var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");
var cheerio = require('cheerio');
    var requestPromise = require('request-promise')
var request = require('request');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/getRentalHouseList', function (req, res, next) {

    var request = require('request');

    var gooCode = req.query.gooCode;

    var url = 'https://data.myhome.go.kr:443/rentalHouseList';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=sPD0qNJcHqeO3kIbhWko1GTuFI60zd%2FbJenfCXjNKHrM8SCm3PKDeUUoAe5eVcgXjebECjwQDvJPNIhEd2Dk6w%3D%3D';
    /* Service Key*/
    queryParams += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('sPD0qNJcHqeO3kIbhWko1GTuFI60zd%2FbJenfCXjNKHrM8SCm3PKDeUUoAe5eVcgXjebECjwQDvJPNIhEd2Dk6w%3D%3D');
    /* 공공데이터포털에서 받은 인증키 */
    queryParams += '&' + encodeURIComponent('brtcCode') + '=' + encodeURIComponent('11');
    /* 광역시도 코드 */
    queryParams += '&' + encodeURIComponent('signguCode') + '=' + encodeURIComponent(gooCode);
    /* 시군구 코드 */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('50');
    /* 조회될 목록의 페이지당 데이터 개수 (기본값:10) */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    /* 조회될 페이지의 번호 (기본값:1) */

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        console.log('Status', response.statusCode);
        console.log('Headers', JSON.stringify(response.headers));
        //console.log('Reponse received', body.hsmpList);

        res.json({result: body});


    });
});





router.get('/shoe/:page', function (req, res, next) {


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


    var _resultJson = [];

    requestPromise(page).then(html => {
        var reqResult = parseDomData(html);

        for ( var i=1; i<reqResult.length;i++){

            _resultJson.push(reqResult[i])
        }

        res.json({result: _resultJson});

    })


});//scrap001 route end


router.get('/shoesListAll', function (req, res, next) {


    var page1 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96';
    var page2 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=96&p=96'
    var page3 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=192&p=96'
    var page4 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=288&p=96'

    var _resultJson = [];

    requestPromise(page1).then(html => {
        var reqResult = parseDomData(html);

        for (var i = 0; i < reqResult.length; i++) {

            _resultJson.push(reqResult[i])
        }

        return requestPromise(page2)

    }).then(page2 => {

        var reqResult = parseDomData(page2);

        for (var i = 0; i < reqResult.length; i++) {

            _resultJson.push(reqResult[i])
        }

        return requestPromise(page3)
    }).then(page3 => {

        var reqResult = parseDomData(page3);

        for (var i = 0; i < reqResult.length; i++) {

            _resultJson.push(reqResult[i])
        }

        return requestPromise(page4)
    }).then(page4 => {

        var reqResult = parseDomData(page4);

        for (var i = 0; i < reqResult.length; i++) {

            _resultJson.push(reqResult[i])
        }

        res.json({result: _resultJson});
    })


});//scrap001 route end


router.get('/shoesListAll2', function (req, res, next) {


    var page1 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96';
    var page2 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=96&p=96'
    var page3 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=192&p=96'
    var page4 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=288&p=96'


    var _resultJson = [];

    requestPromise(page1).then(html => {
        var reqResult = parseDomData(html);


        _resultJson.push({

            data: reqResult
        })


        return requestPromise(page2)

    }).then(page2 => {

        var reqResult = parseDomData(page2);


        _resultJson.push({

            data: reqResult
        })


        return requestPromise(page3)
    }).then(page3 => {

        var reqResult = parseDomData(page3);


        _resultJson.push({

            data: reqResult
        })


        return requestPromise(page4)
    }).then(page4 => {

        var reqResult = parseDomData(page4);


        _resultJson.push({

            data: reqResult
        })


        res.json({result: _resultJson});
    })


});//scrap001 route end


function parseDomData(html) {

    var $ = cheerio.load(html);

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

        resultJson.push({
            "shoesFullname": shoesFullname,
            "shoesId": shoes_id,
            "imageBaseUrl": 'http://s7ondemand1.scene7.com/is/image/roadrunnersports/',
            "shoeDetailUrl": shoeDetailUrl

        })

    })

    // console.log(resultJson);

    res.json({result: resultJson});


}


router.get('/__shoes/:page', function (req, res, next) {


    var pPage = req.params.page


    var page = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96';


    var finalResult = [];


    requestPromise(page).then(html => {
        var reqResult = parseDomData(html);


        finalResult.push({

            data: reqResult
        })


        res.json({result: finalResult});

    });


});//scrap001 route end



router.get('/getShoesInfo/:shoeId', function (req, res, next) {


    var shoeId = req.params.shoeId


    var page = 'http://www.roadrunnersports.com/rrs/products/'+ shoeId;
    var samplepage = 'http://www.roadrunnersports.com/rrs/products/14948'


    var finalResult = [];


    requestPromise(page, function(error, response, body) {
        if (error) throw error;

        var $ = cheerio.load(body);

        shoeDetail= $('#product_desc_content').children().children("p").text();

        var shoeType = $('#videoLinkButton').next().children().children("img").attr('alt');


        console.log(shoeDetail);
        console.log(shoeType);

        if ( shoeType == undefined){
            shoeType = 'none';
        }else{

            var arrShoeType  = shoeType.split(':');
            shoeType = arrShoeType[0];
        }

        var result ={

            shoeDetail : shoeDetail,
            shoeType : shoeType

        }

        res.json({result: result});

    })

});//scrap001 route end



module.exports = router;
