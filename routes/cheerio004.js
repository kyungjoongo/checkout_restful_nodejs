var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');
var fetch = require("node-fetch");


/*requestPromise("http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96", function (error, response, body) {*/


var res = syncRequest('GET', 'http://www.roadrunnersports.com/rrs/products/14948/');

var $ = cheerio.load(res.getBody());

var resultJson= [];

$('.pr-comments').each(function () {
    var comments = $(this).text();


    resultJson.push({
        "comments" : comments,
        "rating" : 0

    });


});


var res2 = syncRequest('GET', 'http://www.roadrunnersports.com/rrs/products/14948/');
$ = cheerio.load(res2.getBody());

$('.pr-rating').each(function () {
    var rating = $(this).text();

    console.log(rating);


    for ( var i=0 ; i<resultJson.length;i++){

        resultJson[i].rating = rating;
    }

});




console.log(resultJson);





