var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')
var syncRequest = require('sync-request');
var fetch = require("node-fetch");


/*requestPromise("http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96", function (error, response, body) {*/


var res = syncRequest('GET', 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=12');

var $ = cheerio.load(res.getBody());

var resultJson = [];

$('#skuDiv').each(function () {
    var image_url = $(this).children().children(".product-image").attr("src");

    var shoes_id = $(this).children().children(".product-image").attr("id");

    var shoes_ids = shoes_id.split("_");

    shoes_id = shoes_ids[0]

    /*console.log(shoes_id)*/

    var shoe_brand = $(this).children().children(".shoe-name").children().children("#" + shoes_id + '_brand').text();

    shoe_brand = shoe_brand.substr(7, shoe_brand.length);
    var shoe_name = $(this).children().children(".shoe-name").children().children("#" + shoes_id + '_name').text();

    var product_image_url = $(this).children().children(".product-image").attr('src');

    /*console.log("\n" + shoe_brand + " " + shoe_name + "\n" + "\n");
    console.log(shoes_id);*/

    var shoesFullname = shoe_brand + " " + shoe_name;
    var shoeDetailUrl = 'http://www.roadrunnersports.com/rrs/products/' + shoes_id;

    /*

    //#########################################
    var responseDetail = syncRequest('GET', shoeDetailUrl);*/

/*
    var $2 = cheerio.load(responseDetail.getBody());


    var desc = $2('#product_desc_content').children().children("p").text();

    var shoeType = $2('#videoLinkButton').next().children().children("img").attr('alt');

    var shoeTypeImage = $2('#videoLinkButton').next().children().children("img").attr('src');


    var level = $2('#videoLinkButton').next().children().next().children("img").attr('src');

    var arrShoeType = shoeType.split(':');
    shoeType = arrShoeType[0];*/


    resultJson.push({
        "shoesBrand" : shoe_brand,
        "shoesFullname": shoesFullname,
        "shoesId": shoes_id,
        "imageBaseUrl": 'http://s7ondemand1.scene7.com/is/image/roadrunnersports/',
        "shoeDetailUrl" : shoeDetailUrl,
        "product_image_url" :product_image_url

    })


});


console.log(resultJson);





