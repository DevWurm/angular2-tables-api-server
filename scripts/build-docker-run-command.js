'use strict';
var version = require('../package.json').version;

var options = ['HTTP', 'HTTP_PORT', 'SERVER_ADDR', 'HTTPS', 'HTTPS_PORT', 'HTTPS_CERT', 'HTTPS_KEY', 'ES_ADDR', 'ES_PORT', 'ES_INDEX', 'ES_TYPE'];

var configuration = options.map(function(option) {
    return process.env[option] ? {option: option, value: process.env[option]} : null;
}).filter(function (config) {
    return Boolean(config);
});

var dockerString = configuration.reduce(function (acc, config) {
    return acc + " -e \"" + config.option + "=" + config.value + "\"";
}, "docker run -d") + " wikiviews-api-server:" + version;

console.log(dockerString);
