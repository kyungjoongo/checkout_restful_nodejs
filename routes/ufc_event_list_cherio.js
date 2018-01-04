var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');
var fetch = require("node-fetch");
var mergeJSON = require("merge-json");

/*requestPromise("http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96", function (error, response, body) {*/

var res = syncRequest('GET', 'http://kr.ufc.com/');

var $ = cheerio.load(res.getBody());
var fianlresultJson = new Array()
var index = 1;
$('#ad-area').each(function () {

    var fight_title = $(this).next().attr('href')

//    console.log('http://kr.ufc.com' + fight_title);

    var url = 'http://kr.ufc.com' + fight_title;

    fianlresultJson.push({

        title : fight_title,
        url :url

    });


});


console.log(fianlresultJson);
console.log("###" + fianlresultJson.length);





