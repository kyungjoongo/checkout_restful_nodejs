var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');
var fetch = require("node-fetch");
var mergeJSON = require("merge-json");

/*requestPromise("http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96", function (error, response, body) {*/

var res = syncRequest('GET', 'http://kr.ufc.com/event/ufc-fight-night-st-louis-january-14-2018#/fight');

var $ = cheerio.load(res.getBody());
var fianlresultJson = new Array()
var index = 1;


var title= ''

$('#titleArea').each(function () {

    title = $(this).text();

    console.log(title);

});


var imageListArray = new Array()
$('.fight').each(function () {


    var fighter_image1 = $(this).children().children().children('img').attr('src');
    var fighter_image2 = $(this).children().next().next().children().children('img').attr('src');

    var figher_name1 = $(this).find('.fighter-name1').text();
    var figher_name2 = $(this).find('.fighter-name2').text();
    /*var figher_name1 = $(this).children().next().next().children().children('img').attr('src');*/

    figher_name1 = figher_name1.replace("WIN", "").replace('**', '').trim();
    figher_name2 = figher_name2.replace("WIN", "").replace('**', '').trim();

    var fighterfirstname = $(this).find('.fighter-first-name').html();
    console.log('fighterfirstname'+ fighterfirstname);



    var fighter_names1= fighter_image1.split("/")
    var extract_fighter_name1 =  fighter_names1[5];

    var fighter_names2= fighter_image2.split("/")
    var extract_fighter_name2 =  fighter_names2[5];

    console.log("###-->" + extract_fighter_name1 +"###"+  extract_fighter_name2 );

    fighter_image1 ='http://'+  fighter_image1.substring(2,fighter_image1.length)
    fighter_image2 ='http://'+  fighter_image2.substring(2,fighter_image2.length)

    console.log("####"+ fighter_image1);
    console.log("####"+ figher_name2);

    imageListArray.push({
        fighter_image1: fighter_image1,
        fighter_image2: fighter_image2,
        figher_name1 : figher_name1,
        figher_name2 : figher_name2,
        extract_fighter_name1 : extract_fighter_name1,
        extract_fighter_name2 : extract_fighter_name2
    })


});

fianlresultJson.push({
    title: title,
    fight_images :imageListArray

})



/*console.log(fianlresultJson);
console.log("###" + fianlresultJson.length);*/





