var request = require("request");
var cheerio = require("cheerio");
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');




var res = syncRequest('GET', 'http://www.ufc.com/fighter/');
var $ = cheerio.load(res.getBody());

var fianlresultJson = new Array()
$('.title-holder').each(function () {


    var fighter_infos = $(this).children().children().attr('alt');

    /*fighter-wld*/
    var fighters_wld = $(this).find('.fighter-wld').text();

    var _temp_array = fighter_infos.split("-");

    console.log(_temp_array[0]);


    var fighter_name = _temp_array[0];

    var _temp_array2 = (_temp_array[1].split(':'));

    var weight_class = _temp_array2[1];
    var fighter_image = $(this).children().next().children('img').attr('src');

    fighter_image = fighter_image.substring(2, fighter_image.length)


    console.log(fighter_infos)
    console.log(fighter_image)

    fianlresultJson.push({
        fighter_name: fighter_name,
        weight_class : weight_class,
        fighter_image: 'https://'+ fighter_image,
        fighters_wld:fighters_wld
    })


});




console.log(fianlresultJson);
console.log("###" + fianlresultJson.length);





