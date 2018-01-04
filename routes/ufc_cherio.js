var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');
var fetch = require("node-fetch");
var mergeJSON = require("merge-json") ;

/*requestPromise("http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96", function (error, response, body) {*/

var res = syncRequest('GET', 'http://kr.ufc.com/');

var $ = cheerio.load(res.getBody());
var fianlresultJson =new Array()
var index = 1;
$('#fightcardtab0').each(function () {

    var fight_title = $(this).children().text();

/*    console.log(fight_title);*/

//fightcardtab0

    $('#fight-card-section').each(function () {
        var fightImageJson = [];
        $('.fight').each(function () {
            var fighter_image1 = $(this).children().children().children('img').attr('src');
            var fighter_image2 = $(this).children().next().next().next().next().children().children('img').attr('src');

            fightImageJson.push({
                fighter_image1: fighter_image1,
                fighter_image2: fighter_image2
            })


        });

        console.log("##########" + JSON.stringify(fightImageJson));


        fianlresultJson.push(fightImageJson);

    });



   // console.log(index+ ":"+ fight_title.trim());


    index++;




});



console.log(fianlresultJson[0]);
console.log("###" + fianlresultJson.length);





