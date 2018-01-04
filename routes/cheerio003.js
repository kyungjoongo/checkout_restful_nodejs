var request = require("request");
var cheerio = require("cheerio");
/*var url = "http://www.roadrunnersports.com/rrs/products/16161";*/
var requestPromise = require('request-promise')

requestPromise(url= "http://www.roadrunnersports.com/rrs/products/16161", function(error, response, body) {
    if (error) throw error;

    var $ = cheerio.load(body);


    var desc= $('#product_desc_content').children().children("p").text();

    var shoeType = $('#videoLinkButton').next().children().children("img").attr('alt');
    var arrShoeType  = shoeType.split(':');
    shoeType = arrShoeType[0];

    console.log(desc);
    console.log(shoeType);



    return desc;


});