# Wikiviews api-server
The api-server for the wikiviews application. It provides access to the analyzed and indexed [Wikipedia Pageviews](https://dumps.wikimedia.org/other/pageviews/) data via an RESTful API.

Therefor it uses an ElasticSearch Cluster to store, index and query the data. The ElasticSearch backend can be created with [wikiviews-elasticsearch](https://github.com/Wikiviews/wikiviews-elasticsearch) and provisioned with the [wikiviews-importer](https://github.com/Wikiviews/wikiviews-importer)

## Usage
The server gets configured via environment variables and can be started locally or inside a docker container.

### Configuration
The server gets configured via the following environment variables:
* `HTTP`: If set, a HTTP server will be provided
    * `HTTP_PORT`: The port, on which the HTTP server listens (Default: `80`)
    * `SERVER_ADDR`: The address, on which the HTTP server listens (Default: every local address)
* `HTTPS`: If set, a HTTPS server will be provided
    * `HTTPS_PORT`: The port, on which the HTTPS server listens (Default: `443`)
    * `SERVER_ADDR`: The address, on which the HTTPS server listens (Default: every local address, identical to the `HTTP` server address)
    * `HTTPS_CERT`: Path to the SSL certificate (mandatory, when using HTTPS)
    * `HTTPS_KEY`: Path to the SSL private key (mandatory, when using HTTPS)
* `ES_ADDR`: ElasticSearch address (Default: `localhost`)
* `ES_PORT`: ElasticSearch port (Default: `9200`)
* `ES_INDEX`: ElasticSearch index for the application data (Default: `wikiviews`, matches the setup provided by [wikiviews-importer](https://github.com/Wikiviews/wikiviews-importer))
* `ES_TYPE`: ElasticSearch type for the article data (Default: `article`, matches the setup provided by [wikiviews-importer](https://github.com/Wikiviews/wikiviews-importer))

### Backend setup
The setup for the ElasticSearch backend is described in [wikiviews-elasticsearch](https://github.com/Wikiviews/wikiviews-elasticsearch)

### Run with Docker
#### Using the official image
The project provides a [Docker image in the Docker Hub](https://hub.docker.com/r/wikiviews/wikiviews-api-server/). You can download this image with
```shell
docker pull wikiviews/wikiviews-api-server
```
This image is automatically generated for each repository tag via [Travis-CI](https://travis-ci.org/Wikiviews/wikiviews-api-server) ([![Build Status](https://travis-ci.org/Wikiviews/wikiviews-api-server.svg?branch=master)](https://travis-ci.org/Wikiviews/wikiviews-api-server)).

#### Building your own image
If you want to include local changes, use your own tag, etc. you can build your own image from this repository.<br>
To build the Docker image for the Wikiviews Api-Server, run:
```shell
docker build -t {TAG-NAME} .
```
or use the Docker build targets ([`build:docker`](#builddocker) and [`start:docker`](#startdocker)).

#### Running a container
To run an instance with , execute:
```shell
docker run -e "{CONFIG_NAME}={CONFIG_VALUE}" -e ... --name {CONTAINER-NAME} -p 80:80 wikiviews/wikiviews-api-server
```

### Running locally
You can run the server without docker by installing the projects package and using the command
```shell
wv-api-server
```
#### Using the npm package
The project provides an [NPM package](https://www.npmjs.com/package/@wikiviews/wikiviews-api-server)([![npm version](https://badge.fury.io/js/%40wikiviews%2Fwikiviews-api-server.svg)](https://badge.fury.io/js/%40wikiviews%2Fwikiviews-api-server)), which can be installed via
```shell
npm install -g @wikiviews/wikiviews-importer
```
This package is automatically generated for each repository tag via [Travis-CI](https://travis-ci.org/Wikiviews/wikiviews-api-server) ([![Build Status](https://travis-ci.org/Wikiviews/wikiviews-api-server.svg?branch=master)](https://travis-ci.org/Wikiviews/wikiviews-api-server)).

#### Building from project sources
You can also install the package locally by using the project sources. Therefor clone the project and run
```
npm install && npm run build && npm install -g
```
inside the project directory.

## API 
The API-Server uses a RESTful API to provide the information for the Wikiviews application. The following endpoints are provided:

### `GET /articles`
Provides access to all articles with their corresponding view-count.

#### Request
The request is parametrized via `GET` parameters.

Parameter | Type | Description | Default | Example
--- | --- | --- | --- | ---
`index` | Integral number | The number of the first element returned from the result set. | `0` | `index=10`
`count` | Integral number | The number of elements returned from the result set. | `10` | `count=50`
`sorting` | Array of Strings in the format `+/-property` | Sorts the articles for the result set ascending (`+`) or descending (`-`) (Default: ascending) in respect to the `property` (`article` or a date in the format `yyyy-mm-dd-hh`.<br> If multiple sorting elements are defined in the array, the articles are sorted by multiple properties in the priority defined by the position in the array (first element is the primary sorting element). | `+article` | `sorting[0]=-article`, <br>`sorting[0]=+2016-07-08-05&sorting[1]=-2016-07-05-06`
`filter` | String | Fulltext search filter applied to the articles for the result set.| *None* | `filter=Cheese`
`range` | Array of Objects having two String properties (`from` and `to`) | Defines alphabetical ranges which can be excluded or included in the result set (see the `mode` parameter). | Range containing no articles | `range[0][from]=a&range[0][to]=z`<br> `range[0][from]=a&range[0][to]=bu&range[1][from]=ka&range[1][to]=ku`
`mode` | String (`including` or `excluding`) | Defines if the articles defined by the `range` parameter should be the only ones included for the result set (`including`) or if they should be the only ones *not* included for the result set (`excluding`) | `excluding` | `mode=excluding`, `mode=including`

#### Response
The server responds with a JSON document with the following structure:
```json
[
  {
    "article": "String: article name",
    "views": [
      {
        "date": "String: date in format yyyy-mm-dd-hh",
        "views": "Number: number of views for the corresponding date"
      },
      ...
    ]
  },
  ...
]
```

#### Example
<!-- TODO: Example -->

### `GET /articles/names`
Provides access to the names of all articles.

#### Request
The request is parametrized via `GET` parameters.

Parameter | Type | Description | Default | Example
--- | --- | --- | --- | ---
`index` | Integral number | The number of the first element returned from the result set. | `0` | `index=10`
`count` | Integral number | The number of elements returned from the result set. | `10` | `count=50`
`sorting` | String (`+` or `-`) | Sorts the articles lexicographically for the result set ascending (`+`) or descending (`-`) in respect to their name. | `+` | `sorting=-`, <br>`sorting=+`
`filter` | String | Fulltext search filter applied to the articles for the result set.| *None* | `filter=Cheese`

#### Response
The server responds with a JSON document with the following structure:
```json
[
  "String: article name 1",
  "String: article name 2",
  ...
]
```

#### Example
<!-- TODO: Example -->

### `GET /articles/dates`
Provides access all dates, which are recorded.

#### Request
The request is not parametrized.

#### Response
The server responds with a JSON document with the following structure:
```json
[
  "String: date 1 in the format yyyy-mm-dd-hh",
  "String: date 2 in the format yyyy-mm-dd-hh",
  ...
]
```

#### Example
<!-- TODO: Example -->

## Development
The project uses NPM as build system. Before you run any of the defined scripts, make sure you ran `npm install`.

The following targets are available:
#### `clean`
Removes all build files.
```shell
npm run clean
```

#### `flow`
Typechecks the project with [Flow](https://flowtype.org/). If no Flow server is already running, it starts a new one.
```shell
npm run flow
```

##### `flow:stop`
Stops a possibly running Flow server.
```shell
npm run flow:stop
```

#### `test`
Runs unit tests for the project.
```shell
npm run test
```
##### `test:debug`
Runs the unit test in a debugger.
```shell
npm run test:debug
```

##### `test:cover`
Runs the unit test and generates a coverage report.
```shell
npm run test:cover
```

#### `build`
Builds the project. Transpiles all ES6 files and generates the output under `lib`.
```shell
npm run build
```

##### `build:dev`
Builds the project in development mode. It generates source-maps while transpiling.
```shell
npm run build:dev
```

##### `build:docker`
Builds the project and a docker container running the server. Make sure, that you have access to a docker daemon.
```shell
npm run build:docker
```

#### `start`
Builds the project and runs it locally. The server is configured with the currently set environment variables.
```shell
npm run start
```

##### `start:docker`
Builds the project and a docker runs the container. The server is configured with the currently set environment variables.
```shell
npm run start:docker
```
