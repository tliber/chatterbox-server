/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
  var acceptableURL = /\.*classes\.*/
  //acceptableURL.test('')
  var result = [];
  var messageData = {results:result};

module.exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  //messageData = JSON.stringify(messageData);
  // The outgoing status.


  if (!(acceptableURL.test(request.url+""))){
    console.log(request.url);
    console.log('404ed')
    var statusCode = 404;var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    response.end('Page not found');
  }

  if (request.method === 'GET' && acceptableURL.test(request.url+"")){

    var statusCode = 200;
    messageDataStr = JSON.stringify(messageData);
    // console.log(messageData.results);
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    response.end(messageDataStr);
  }

  if (request.method === 'POST' && acceptableURL.test(request.url+"")){
    var statusCode = 201;
    var testString = '';

    //var newMessage = {};


    // newMessage.username = request.username || '';
    // newMessage.message = request.message || '';
    // newMessage.room = request.room || '';
    // newMessage.createdAt = new Date();

    request.on('data',function(chunk){
      testString = testString.concat(chunk);
    });
    request.on('end',function(){
      var newMessage = JSON.parse(testString);
      result.push(newMessage);
      messageDataStr = JSON.stringify(messageData);
      console.log(messageData.results);
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = "application/json";
      response.writeHead(statusCode, headers);
      response.end(messageDataStr);
    });
  }


  // See the note below about CORS headers.
  //var headers = defaultCorsHeaders;
  //headers['Content-Type'] = "application/json";
  //   response.writeHead(statusCode, headers);

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.

  //var messageData = {'results':results};
  //messageData = JSON.stringify(messageData);
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end(messageData);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

