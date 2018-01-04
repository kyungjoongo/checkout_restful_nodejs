var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");
var cheerio = require('cheerio');
var requestPromise = require('request-promise')
var request = require('request');
var syncRequest = require('sync-request');

router.get('/event_list', function (req, _response, next) {


    var res = syncRequest('GET', 'http://kr.ufc.com/');

    var $ = cheerio.load(res.getBody());
    var fianlresultJson = new Array()
    var index = 1;
    $('#ad-area').each(function () {

        var fight_title = $(this).next().attr('href')

//    console.log('http://kr.ufc.com' + fight_title);

        var url = 'http://kr.ufc.com' + fight_title;


        fight_title  = fight_title.replace('/event/', '').replace('#/fight', '');

        fianlresultJson.push({

            title : fight_title,
            url :url

        });


    });

    _response.json({result: fianlresultJson});


});




router.get('/fightcard_detail2/:title', function (req, _response, next) {

    var title = req.params.title;

    /*http://www.ufc.com/event/UFC-220?f1=Stipe-Miocic&f2=francis-ngannou*/

    var res = syncRequest('GET', 'http://www.ufc.com/event/'+ title);

    /*http://www.ufc.com/event/UFC-220#/fight*/
/*
    http://www.ufc.com/event/UFC-220*/

    /*var res = syncRequest('GET', 'http://www.ufc.com/event/UFC-220');

    /!*ufc-fight-night-charlotte-january-27-2018*!/

    var res = syncRequest('GET', 'http://www.ufc.com/event/ufc-fight-night-charlotte-january-27-2018');*/

    /*var res_usa = syncRequest('GET', 'http://www.ufc.com/event/ufc-fight-night-st-louis-january-14-2018?f1=Jeremy-Stephens&f2=Dooho-Choi');*/



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

        console.log("####"+ figher_name1);
        console.log("####"+ figher_name2);

        imageListArray.push({
            fighter_image1: fighter_image1,
            fighter_image2: fighter_image2,
            figher_name1 : figher_name1,
            figher_name2 : figher_name2,
        })


    });

    fianlresultJson.push({
        title: title,
        fight_images :imageListArray

    })


    _response.json({result: fianlresultJson});


});




router.get('/fightcard_detail', function (req, _response, next) {


    var res = syncRequest('GET', 'http://www.ufc.com/event/ufc-fight-night-st-louis-january-14-2018?f1=Jeremy-Stephens&f2=Dooho-Choi');

    var $ = cheerio.load(res.getBody());
    var fianlresultJson =new Array()
    var index = 1;
    $('.fight').each(function () {
        var fighter_image1 = $(this).children().children().children('img').attr('src');
        var fighter_image2 = $(this).children().next().next().children().children('img').attr('src');

        fianlresultJson.push({
            fighter_image1: fighter_image1,
            fighter_image2: fighter_image2
        })


    });

    _response.json({result: fianlresultJson});

});



router.get('/fightcard', function (req, _response, next) {


    var res = syncRequest('GET', 'http://kr.ufc.com/');

    var $ = cheerio.load(res.getBody());
    var fianlResultJson = new Array();
    var index = 1;
    $('.fight-card-tab').each(function () {

        var fight_title = $(this).children().text();


        fianlResultJson.fight_title = fight_title;

        var fightImageJson = [];
        $('.fight').each(function () {
            var fighter_image1 = $(this).children().children().children('img').attr('src');
            var fighter_image2 = $(this).children().next().next().next().next().children().children('img').attr('src');

            var fighters_image_one = {
                fighter_image1: fighter_image1,
                fighter_image2: fighter_image2
            }


        });


        index++;


    });


    _response.json({result: fianlResultJson});

});


module.exports = router;
