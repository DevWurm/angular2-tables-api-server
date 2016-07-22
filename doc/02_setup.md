## Setup Environment
* create `package.json` with your according project details
* install and save `express, mongodb`
* install and save for dev `babel, babel-preset-es2015`
* setup babel transpilation (`.babelrc`) and build scripts (`package.json -> scripts -> build / build:dev`)
* [setup server script](#create-server-script) (`bin/www`), which grabs the main express app component from the compiled file (`lib/app.js`) and starts the servers
The project setup for an express app can be [automatically done by express](https://expressjs.com/en/starter/generator.html). In this case transpilation isn't set up and additional
directories and files for front end serving and templating are created (which is useless for an API server).

## Create server script
* server script is located at `bin/www`
* it sets up and binds the actual server
* because the server script is not transpiled it needs to be written in the lowest language level your application has to support (i.e. plain ES5)
* the server script grabs the express application object from the transpiled `src/app.js` file in `lib/app.js` by using `require('../lib/app.js').default` or `require('../lib/app.js')` if `app.js` is an ES5- file
* the express application object is completly interoperable with the node [http/https requestListener](https://nodejs.org/api/http.html#http_http_createserver_requestlistener) and can therby be used as callback for node's native http/https servers, where it performs the tasks, which were specified using the framework possibilities of express
* information, which are necessary for the server my be provided via environment variables (`process.env.[VARIABLE_NAME]`), which are set at the host or in the application container

Example:
```javascript
#!/usr/bin env node

var readFile = require("fs").createFile;
var createHttpServer = require("http").createServer;
var createHttpsServer = require("https").createServer;

var app = require('../lib/app').default

// setup server
if (process.env.HTTP) {
    createHttpServer(app).listen(process.env.HTTP_PORT || 8080);
}

if (process.env.HTTPS && process.env.HTTPS_CERT && process.env.HTTPS_KEY) {
    const certPrms = new Promise((resolve. reject) => readFile(process.env.HTTPS_CERT, (err, data) => {if (err) return reject(err); resolve(data);}));
    const keyPrms = new Promise((resolve. reject) => readFile(process.env.HTTPS_KEY, (err, data) => {if (err) return reject(err); resolve(data);}));

    Promise.all([certPrms, keyPrms]).then(([cert, key]) => createHttpsServer({cert: cert, key: key}, app).listen(process.env.HTTPS_PORT || 8443)):
}
```
