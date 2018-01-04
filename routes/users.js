var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");
var cheerio = require('cheerio');
var requestPromise = require('request-promise')
var request = require('request');
var syncRequest = require('sync-request');

requestJson = require('request-json');
var rquestClient = requestJson.createClient('https://www.myhome.go.kr/');

router.get('/lhList', function (req, _response, next) {


    var pageIndex = req.query.pageIndex;
    var srchbrtcCode = req.query.srchbrtcCode;
    var srchsignguCode = req.query.srchsignguCode;


    var url = 'hws/portal/sch/selectRsdtRcritNtcList.do'

    var data = {
        pageIndex: pageIndex
        , searchTyId: ""
        , srchBassMtRntchrg: ""
        , srchHouseTy: ""
        , srchPblancNm: ""
        , srchPrgrStts: ""
        , srchRcritPblancDeYearMtBegin: ""
        , srchRcritPblancDeYearMtEnd: ""
        , srchSuplyPrvuseAr: ""
        , srchSuplyTy: ""
        , srchbrtcCode: srchbrtcCode
        , srchsignguCode: srchsignguCode
    }


    rquestClient.post(url, data, function (err, res, body) {


        _response.json({result: body});
    });


});


router.get('/checkout', function (req, _response, next) {

    var query = req.query.query;
    var page = req.query.page;
    var sort = req.query.sort

    /*var query = req.body.query;
    var page = req.body.page;*/
    if (query == undefined) {
        query = '나이키 페가수스 34'
    }

    if (page == undefined) {
        page = 1;
    }

    if (sort == undefined) {
        sort = 'rel';
    }

    query = encodeURIComponent(query);


    var res = syncRequest('GET', 'https://search.shopping.naver.com/search/all.nhn?' +
        'pagingIndex=' + page +
        '&pagingSize=40&viewType=list' +
        '&sort=' + sort +
        //price_asc , rel
        '&frm=NVSHPAG' +
        '&query=' + query);

    var $ = cheerio.load(res.getBody());

    var resultJson = [];

    $('._model_list').each(function () {
        var comments = $(this).children().children().children('._productLazyImg').attr('alt');
        //data-original
        var imageUrl = $(this).children().children().children('._productLazyImg').attr('data-original');
        var info = $(this).children().next().children().children().children('._price_reload').text()

        var detailUrl = $(this).children().children('a').attr('href')


        resultJson.push({
            "comments": comments,
            imageUrl: imageUrl,
            info: info,
            detailUrl: detailUrl

        });


    });

    /* console.log(resultJson);*/

    _response.json({result: resultJson});

});


router.get('/shoe_v2/:page', function (req, res, next) {


    var pPage = req.params.page
    var page = '';

    if (pPage == '1') {

        page = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96';
    } else if (pPage == '2') {
        page = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=96&p=96'

    } else if (pPage == '3') {
        page = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=192&p=96'

    } else if (pPage == '4') {

        page = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=288&p=96'
    }


    var finalJson = [];

    var requestResult = syncRequest('GET', page);

    var reqResult = parseDomData2(requestResult);

    for (var i = 1; i < reqResult.length; i++) {

        finalJson.push(reqResult[i])
    }

    res.json({result: finalJson});


});//scrap001 route end


function parseDomData2(requestResult) {


    var $ = cheerio.load(requestResult.getBody());

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


        resultJson.push({
            "shoesBrand": shoe_brand,
            "shoesName": shoe_name,
            "shoesFullname": shoesFullname,
            "shoesId": shoes_id,
            "imageBaseUrl": 'http://s7ondemand1.scene7.com/is/image/roadrunnersports/',
            "shoeDetailUrl": shoeDetailUrl,
            "product_image_url": product_image_url

        })


    });


    return resultJson;


}


router.get('/getReview/:shoeId', function (req, _response, next) {

    var shoeId = '';

    shoeId = req.params.shoeId


    var res = syncRequest('GET', 'http://www.roadrunnersports.com/rrs/products/' + shoeId);

    var $ = cheerio.load(res.getBody());

    var resultJson = [];

    $('.pr-comments').each(function () {
        var comments = $(this).text();


        resultJson.push({
            "comments": comments,
            "rating": 0

        });


    });


    var res2 = syncRequest('GET', 'http://www.roadrunnersports.com/rrs/products/14948/');
    $ = cheerio.load(res2.getBody());

    $('.pr-rating').each(function () {
        var rating = $(this).text();

        console.log(rating);


        for (var i = 0; i < resultJson.length; i++) {

            resultJson[i].rating = rating;
        }

    });

    _response.json({result: resultJson});

});


router.get('/getAllList', function (req, _response, next) {


    /*var url1 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=12';
    var url2 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=12&p=12';*/

    var page1 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96';
    var page2 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=96&p=96'
    var page3 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=192&p=96'
    var page4 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=288&p=96'

    var finalJson = [];
    var result = [];

    result = getRequestData(page1);
    for (var i = 0; i < result.length; i++) {

        finalJson.push(result[i]);
        console.log(result[i]);
    }

    result = getRequestData(page2);
    for (var i = 0; i < result.length; i++) {
        finalJson.push(result[i]);
        console.log(result[i]);
    }

    result = getRequestData(page3);
    for (var i = 0; i < result.length; i++) {
        finalJson.push(result[i]);
        console.log(result[i]);
    }

    result = getRequestData(page4);
    for (var i = 0; i < result.length; i++) {
        finalJson.push(result[i]);
        console.log(result[i]);
    }


    _response.json({result: finalJson});


})


function getRequestData(url) {

    var res = syncRequest('GET', url);


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

        /*console.log("\n" + shoe_brand + " " + shoe_name + "\n" + "\n");
        console.log(shoes_id);*/

        var shoesFullname = shoe_brand + " " + shoe_name;

        var shoeDetailUrl = 'http://www.roadrunnersports.com/rrs/products/' + shoes_id;


        //#########################################
        var responseDetail = syncRequest('GET', shoeDetailUrl);


        var $2 = cheerio.load(responseDetail.getBody());


        var desc = $2('#product_desc_content').children().children("p").text();

        var shoeType = $2('#videoLinkButton').next().children().children("img").attr('alt');

        var shoeTypeImage = $2('#videoLinkButton').next().children().children("img").attr('src');


        var level = $2('#videoLinkButton').next().children().next().children("img").attr('src');

        if (shoeType == undefined) {
            shoeType = ''
        } else {
            var arrShoeType = shoeType.split(':');
            shoeType = arrShoeType[0];
        }


        resultJson.push({
            "shoesFullname": shoesFullname,
            "shoesId": shoes_id,
            "imageBaseUrl": 'http://s7ondemand1.scene7.com/is/image/roadrunnersports/',
            "shoeDetailUrl": shoeDetailUrl,
            "shoeType": shoeType,
            "desc": desc,
            "shoeTypeImage": shoeTypeImage,
            "level": level

        })


    });

    return resultJson;
}


module.exports = router;
