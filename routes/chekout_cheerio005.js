var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');



var res = syncRequest('GET', 'https://search.shopping.naver.com/search/all.nhn?' +
    'pagingIndex=1' +
    '&pagingSize=40&viewType=list' +
    '&sort=rel&frm=NVSHPAG' +
    '&query=%EB%82%98%EC%9D%B4%ED%82%A4%20%ED%8E%98%EA%B0%80%EC%88%98%EC%8A%A4');

var $ = cheerio.load(res.getBody());

var resultJson = [];

$('._model_list').each(function () {
    var comments = $(this).children().children().children('._productLazyImg').attr('alt');
    //data-original
    var imageUrl = $(this).children().children().children('._productLazyImg').attr('data-original');
    var info = $(this).children().next().children().children().children('._price_reload').text()

    console.log(info)

    resultJson.push({
        "comments": comments,
        imageUrl: imageUrl,
        info : info

    });


});

console.log(resultJson);
console.log(resultJson.length);









