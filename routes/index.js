var express = require('express');
var router = express.Router();
var beautify = require("json-beautify");

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

var cheerio = require('cheerio');
var rp = require('request-promise')
var request = require('request');


router.get('/scrap001', function (req, res, next) {


    var page1 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?p=96';
    var page2 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=96&p=96'
    var page3 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=192&p=96'
    var page4 = 'http://www.roadrunnersports.com/rrs/mensshoes/mensshoesrunning/?skip=288&p=96'


    var _resultJson = [];

    rp(page1).then(html=>{
        var reqResult = parseDomData(html);

        _resultJson.push(reqResult)

        return rp(page2)

    }).then(page2=>{

        var reqResult = parseDomData(page2);

        _resultJson.push(reqResult)

        return rp(page3)


    }).then(page3=>{

        var reqResult = parseDomData(page3);

        _resultJson.push(reqResult)


        return rp(page4)
    }).then(page4=>{

        var reqResult = parseDomData(page4);

        _resultJson.push(reqResult)

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


        resultJson.push({
            shoesFullname: shoesFullname,
            shoesId: shoes_id,
            imageBaseUrl: 'http://s7ondemand1.scene7.com/is/image/roadrunnersports/'
        })

        //largeIMage  :http://s7ondemand1.scene7.com/is/image/roadrunnersports/08911


    })

    return resultJson;


}


module.exports = router;
