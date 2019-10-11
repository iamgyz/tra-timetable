var target = require("../index.js");

const expect = (_result,_expect)=>{
    if(_result != _expect){
        throw 'Case failed: Expect='+_expect+", Actual="+_result
    }
}

describe("Wrong Start Station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
          s: "不存在",
          e: "桃園"
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,200);
      expect(res.payload.status,'err');
      expect(res.payload.data.length>0,false);

    }).timeout(2000);
  });

  describe("Wrong End Station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
          s: "桃園",
          e: "不存在"
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,200);
      expect(res.payload.status,'err');
      expect(res.payload.data.length>0,false);

    }).timeout(2000);
  });


  describe("Same Station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
          s: "桃園",
          e: "桃園"
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,200);
      expect(res.payload.status,'err');
      expect(res.payload.data.length>0,false);

    }).timeout(30000);
  });

  describe("No query string for start station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
          e: "桃園"
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,556);

    }).timeout(2000);
  });

  describe("No query string for end station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
          s: "桃園"
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,556);

    }).timeout(2000);
  });

  describe("No query string for all station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,556);

    }).timeout(2000);
  });

  /*This case would fail when query time is 23:57 */
  describe("Correct Station", () => {
    it("TestCase1",async () => {
      let req = {
        query: {
          s: "松山",
          e: "台北"
        }
      };
      let res = {
        payload: null,
        statusCode: 0,
        setHeader: () => {},
        send(data) {this.payload = data;return this;},
        status(s){this.statusCode = s; return this;}
      };
      await target(req,res)
      expect(res.statusCode,200);
      expect(res.payload.msg,'');
      expect(res.payload.status,'ok');
      expect(res.payload.data.length>0,true);
    }).timeout(30000);
  });