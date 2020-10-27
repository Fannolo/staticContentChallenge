var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var server = http;
var Mustache = require("mustache");
const { Buffer } = require("buffer");

var showdown = require("showdown");
var converter = new showdown.Converter();

//onRequest callback to render the stuff
async function onRequest(request, response) {
  var pathname = url.parse(request.url).pathname;
  var ext = path.extname(pathname);
  //all request to / renders the template without any other informations
  if (request.url == "/") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(fs.readFileSync("./template.html", "utf8"));
  } else if (ext) {
    //all requests that includes .ico .css .js
    if (ext != ".ico") {
      if (ext === ".css") {
        response.writeHead(200, { "Content-Type": "text/css" });
      } else if (ext === ".js") {
        response.writeHead(200, { "Content-Type": "text/js" });
      }
      response.end();
    }
  } else {
    //write in the response the file rendered in index.md
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    try {
      //   console.log(request);
      if (request.method == "POST") {
        let data = [];
        await request.on("data", function (chunk) {
          data.push(chunk);
        });
        await request.on("end", function () {
          var json = Buffer.concat(data);
          var jobData = JSON.parse(json);
            response.write(
              Mustache.render(fs.readFileSync("./template.html", "utf8"), {
                content: converter?.makeHtml(jobData?.markdown),
              })
            );
          response.end();
        });
      } else {
        let pathNameToRender = "./content" + pathname + "/index.md";
        let fileToRender = fs.readFileSync(pathNameToRender, "utf8");
        response.write(
          Mustache.render(fs.readFileSync("./template.html", "utf8"), {
            content: converter.makeHtml(fileToRender),
          })
        );
        response.end();
      }
    } catch (e) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end();
    }
  }
}

//Start the node server to liste on the port 8080
//server.createServer(onRequest).listen(process.env.PORT || 8080);

module.exports = server
  .createServer(onRequest)
  .listen(process.env.PORT || 3000);
