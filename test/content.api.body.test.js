let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();
const chaiHtml = require("chai-html");

chai.use(chaiHttp);
chai.use(chaiHtml);

describe("Api Content", () => {
  describe("/GET content", () => {
    it("it should return a 200 ", (done) => {
      chai
        .request(server)
        .post("/ciao")
        .send({ markdown: "# This is a test" })
        .end((err, res) => {
          res.should.have.status(200);
          //   console.log("twice in once", res);
          done();
        });
    });
  });
  describe("/GET content body", () => {
    it("it should contain an HTML body ", (done) => {
      chai
        .request(server)
        .post("/ciao")
        .send({ markdown: "# This is a test" })
        .end((err, res) => {
          chai
            .expect(res.text)
            .html.to.equal(
              "<!doctype html>\n" +
                "<html>\n" +
                "    <head>\n" +
                "        <title>Welcome to Acme</title>\n" +
                "    </head>\n" +
                "    <body>\n" +
                '      <h1 id="thisisatest">This is a test</h1>\n' +
                "    </body>\n" +
                "</html>\n"
            );
          done();
        });
    });
  });
  describe("/GET content body", () => {
    it("it should return a 404 ", (done) => {
      chai
        .request(server)
        .get("/ciao")
        .end((err, res) => {
          res.should.have.status(404);
          //   console.log("twice in once", res);
          done();
        });
    });
  });
});
