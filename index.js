var fetch = require("node-fetch");
var htmlparser = require("htmlparser2");
var station = require("./station.json");

function location2code(loc) {
  if (typeof station[loc] != "undefined") {
    return station[loc];
  } else {
    return -1;
  }
}

function getCurHourMin() {
  var d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  );
  var h = d.getHours();
  var m = d.getMinutes();
  h = h >= 10 ? "" + h : "0" + h;
  m = m >= 10 ? "" + m : "0" + m;
  return h + ":" + m;
}

function getTodayDate() {
  var d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  );
  var year = d.getYear() + 1900;
  var month = d.getMonth() + 1;
  var date = d.getDate();
  month = month >= 10 ? "" + month : "0" + month;
  date = date >= 10 ? "" + date : "0" + date;
  return year + "/" + month + "/" + date;
}
/*
https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip112/querybytime
?startStation=1000-臺北
&endStation=1080-桃園
&rideDate=2019/10/11
&startTime=00:00
&endTime=23:59
&trainTypeList=ALL
&transfer=ONE
*/
async function handleQuery(query) {
  var url =
    "https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip112/querybytime";
  url += "?startStation=" + query["fromStation"];
  url += "&endStation=" + query["toStation"];
  url += "&rideDate=" + getTodayDate();
  url += "&startTime=" + getCurHourMin();
  url += "&endTime=" + "23:59";
  url += "&trainTypeList=ALL";
  url += "&transfer=ONE";
  console.log(url);
  try {
    const res = await fetch(url);
    const html = await res.text();
    const json = html2json(html);
    return json;
  } catch (e) {
    throw e;
  }
}

async function lamda(query) {
  let q = {};
  //simple replace and clean
  let s = query.s.trim().replace("台", "臺");
  let e = query.e.trim().replace("台", "臺");

  q["fromStation"] = location2code(s) + "-" + escape(s);
  q["toStation"] = location2code(e) + "-" + escape(e);
  let result = {
    status: "",
    data: [],
    msg: ""
  };
  if (location2code(s) == -1) {
    result.status = "err";
    result.msg = "Wrong start station";
    return result;
  } else if (location2code(e) == -1) {
    result.status = "err";
    result.msg = "Wrong end station";
    return result;
  } else {
    try {
      result.data = await handleQuery(q);
      if (result.data.length == 0) {
        result.status = "err";
        result.msg = "No result from railway";
      } else {
        result.status = "ok";
      }
    } catch (e) {
      result.status = "err";
      result.msg = e;
    }
    return result;
  }
}

function html2json(html) {
  var isStart = false;
  var currentFiled = "";
  var results = [];
  var result = [];
  var parser = new htmlparser.Parser(
    {
      onopentag: function(name, attribs) {
        if (name == "tr" && attribs.class == "trip-column") {
          isStart = true;
        }
        if (name == "td" && attribs.class == "check-way") {
          results.push(result);
          result = [];
          isStart = false;
        }
      },
      ontext: function(text) {
        text = text.trim();
        if (isStart && text.length > 0) {
          result.push(text);
        }
      },
      onclosetag: function(tagname) {}
    },
    { decodeEntities: true }
  );
  parser.write(html);
  parser.end();
  return results;
}

module.exports = async (req, res) => {
  console.log(req.query);
  // Set CORS headers for now.sh
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.query.s && req.query.e) {
    try {
      const data = await lamda(req.query);
      res.send(data);
    } catch (e) {
      res.status(566).send(e);
    }
  } else {
    res.status(556).send({});
  }
};

/*
(async function() {
  const a = await lamda({ s: "桃園", e: "高雄" });
  console.log(a);
})();
*/
