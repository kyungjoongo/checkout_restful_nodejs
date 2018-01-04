var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");
var cheerio = require('cheerio');
var requestPromise = require('request-promise')
var request = require('request');
var syncRequest = require('sync-request');


router.get('/title_holder', function (req, _response, next) {



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

    _response.json({result: fianlresultJson});

});



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


        var imageLeft = $(this).parent().parent().next().children().find('.frame-left').children().children('img').attr('src');
        var imageRight = $(this).parent().parent().next().children().find('.frame-right').children().children('img').attr('src');

        imageLeft ='http://'+  imageLeft.substring(2,imageLeft.length)
        imageRight ='http://'+  imageRight.substring(2,imageRight.length)

        fianlresultJson.push({

            title: fight_title,
            url: url,
            imageLeft: imageLeft,
            imageRight: imageRight

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
