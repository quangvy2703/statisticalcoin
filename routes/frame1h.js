var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bittrex_data'
})

// Load Handlebars 
var Handlebars = require('handlebars');
// Load the package 
var H = require('just-handlebars-helpers');
 
// Register helpers for Handlebars 
H.registerHelpers(Handlebars);

Handlebars.registerHelper("divide", function(thing1, thing2) {
  return thing1 / thing2 ;
});



Handlebars.registerHelper("toFixed", function(number, digits) {
  return Number((number).toFixed(digits));
});


router.get('/', function(req, res, next){
	var all_rows = [];
	var max = 11000;
	var couter = 0;
	var inner_couter = 0;
	res.flush()
	connection.query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'bittrex_data';", function(err, rows, fields){
		if(err) throw err;
		max = rows.length;
	 	for(var i = 0; i < rows.length;i++){
			connection.query("SELECT '" + rows[i].TABLE_NAME + "' as Market, "+
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , Total, 0)), 4) as Buy_h1,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0, Total, 0)), 4) as Sell_h1, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , Total, 0))), 4) as Over_h1, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , 1, 0)) AS NUMS_BUY_ORDER_h1, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , 1, 0)) AS NUMS_SELL_ORDER_h1, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0, Price, 100000)) AS LOWEST_PRICE_h1, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 60 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0, Price, 0)) AS HIGHEST_PRICE_h1, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60 , Total, 0)), 4) as Buy_h2,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60, Total, 0)), 4) as Sell_h2, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60 , Total, 0))), 4) as Over_h2, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60 , 1, 0)) AS NUMS_BUY_ORDER_h2, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60 , 1, 0)) AS NUMS_SELL_ORDER_h2, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60, Price, 100000)) AS LOWEST_PRICE_h2, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=60, Price, 0)) AS HIGHEST_PRICE_h2, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , Total, 0)), 4) as Buy_h3,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120, Total, 0)), 4) as Sell_h3, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , Total, 0))), 4) as Over_h3, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , 1, 0)) AS NUMS_BUY_ORDER_h3, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , 1, 0)) AS NUMS_SELL_ORDER_h3, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120, Price, 100000)) AS LOWEST_PRICE_h3, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 180 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120, Price, 0)) AS HIGHEST_PRICE_h3, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180 , Total, 0)), 4) as Buy_h4,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180, Total, 0)), 4) as Sell_h4, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180 , Total, 0))), 4) as Over_h4, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180 , 1, 0)) AS NUMS_BUY_ORDER_h4, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180 , 1, 0)) AS NUMS_SELL_ORDER_h4, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180, Price, 100000)) AS LOWEST_PRICE_h4, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=180, Price, 0)) AS HIGHEST_PRICE_h4, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , Total, 0)), 4) as Buy_h5,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240, Total, 0)), 4) as Sell_h5, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , Total, 0))), 4) as Over_h5, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , 1, 0)) AS NUMS_BUY_ORDER_h5, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , 1, 0)) AS NUMS_SELL_ORDER_h5, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240, Price, 100000)) AS LOWEST_PRICE_h5, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 300 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240, Price, 0)) AS HIGHEST_PRICE_h5, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300 , Total, 0)), 4) as Buy_h6,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300, Total, 0)), 4) as Sell_h6, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300 , Total, 0))), 4) as Over_h6, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300 , 1, 0)) AS NUMS_BUY_ORDER_h6, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300 , 1, 0)) AS NUMS_SELL_ORDER_h6, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300, Price, 100000)) AS LOWEST_PRICE_h6, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=300, Price, 0)) AS HIGHEST_PRICE_h6, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , Total, 0)), 4) as Buy_h7,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360, Total, 0)), 4) as Sell_h7, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , Total, 0))), 4) as Over_h7, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , 1, 0)) AS NUMS_BUY_ORDER_h7, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , 1, 0)) AS NUMS_SELL_ORDER_h7, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360, Price, 100000)) AS LOWEST_PRICE_h7, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 420 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360, Price, 0)) AS HIGHEST_PRICE_h7, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420 , Total, 0)), 4) as Buy_h8,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420, Total, 0)), 4) as Sell_h8, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420 , Total, 0))), 4) as Over_h8, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420 , 1, 0)) AS NUMS_BUY_ORDER_h8, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420 , 1, 0)) AS NUMS_SELL_ORDER_h8, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420, Price, 100000)) AS LOWEST_PRICE_h8, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=420, Price, 0)) AS HIGHEST_PRICE_h8, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , Total, 0)), 4) as Buy_h9,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480, Total, 0)), 4) as Sell_h9, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , Total, 0))), 4) as Over_h9, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , 1, 0)) AS NUMS_BUY_ORDER_h9, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , 1, 0)) AS NUMS_SELL_ORDER_h9, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480, Price, 100000)) AS LOWEST_PRICE_h9, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 540 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480, Price, 0)) AS HIGHEST_PRICE_h9, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540 , Total, 0)), 4) as Buy_h10,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540, Total, 0)), 4) as Sell_h10, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540 , Total, 0))), 4) as Over_h10, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540 , 1, 0)) AS NUMS_BUY_ORDER_h10, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540 , 1, 0)) AS NUMS_SELL_ORDER_h10, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540, Price, 100000)) AS LOWEST_PRICE_h10, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=540, Price, 0)) AS HIGHEST_PRICE_h10, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , Total, 0)), 4) as Buy_h11,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600, Total, 0)), 4) as Sell_h11, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , Total, 0))), 4) as Over_h11, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , 1, 0)) AS NUMS_BUY_ORDER_h11, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , 1, 0)) AS NUMS_SELL_ORDER_h11, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600, Price, 100000)) AS LOWEST_PRICE_h11, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 660 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600, Price, 0)) AS HIGHEST_PRICE_h11, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660 , Total, 0)), 4) as Buy_h12,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660, Total, 0)), 4) as Sell_h12, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660 , Total, 0))), 4) as Over_h12, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660 , 1, 0)) AS NUMS_BUY_ORDER_h12, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660 , 1, 0)) AS NUMS_SELL_ORDER_h12, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660, Price, 100000)) AS LOWEST_PRICE_h12, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=660, Price, 0)) AS HIGHEST_PRICE_h12, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , Total, 0)), 4) as Buy_h13,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720, Total, 0)), 4) as Sell_h13, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , Total, 0))), 4) as Over_h13, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , 1, 0)) AS NUMS_BUY_ORDER_h13, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , 1, 0)) AS NUMS_SELL_ORDER_h13, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720, Price, 100000)) AS LOWEST_PRICE_h13, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 780 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720, Price, 0)) AS HIGHEST_PRICE_h13, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780 , Total, 0)), 4) as Buy_h14,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780, Total, 0)), 4) as Sell_h14, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780 , Total, 0))), 4) as Over_h14, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780 , 1, 0)) AS NUMS_BUY_ORDER_h14, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780 , 1, 0)) AS NUMS_SELL_ORDER_h14, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780, Price, 100000)) AS LOWEST_PRICE_h14, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=780, Price, 0)) AS HIGHEST_PRICE_h14, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , Total, 0)), 4) as Buy_h15,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840, Total, 0)), 4) as Sell_h15, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , Total, 0))), 4) as Over_h15, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , 1, 0)) AS NUMS_BUY_ORDER_h15, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , 1, 0)) AS NUMS_SELL_ORDER_h15, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840, Price, 100000)) AS LOWEST_PRICE_h15, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 900 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840, Price, 0)) AS HIGHEST_PRICE_h15, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900 , Total, 0)), 4) as Buy_h16,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900, Total, 0)), 4) as Sell_h16, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900 , Total, 0))), 4) as Over_h16, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900 , 1, 0)) AS NUMS_BUY_ORDER_h16, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900 , 1, 0)) AS NUMS_SELL_ORDER_h16, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900, Price, 100000)) AS LOWEST_PRICE_h16, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=900, Price, 0)) AS HIGHEST_PRICE_h16, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , Total, 0)), 4) as Buy_h17,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960, Total, 0)), 4) as Sell_h17, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , Total, 0))), 4) as Over_h17, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , 1, 0)) AS NUMS_BUY_ORDER_h17, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , 1, 0)) AS NUMS_SELL_ORDER_h17, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960, Price, 100000)) AS LOWEST_PRICE_h17, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1020 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960, Price, 0)) AS HIGHEST_PRICE_h17, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020 , Total, 0)), 4) as Buy_h18,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020, Total, 0)), 4) as Sell_h18, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020 , Total, 0))), 4) as Over_h18, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020 , 1, 0)) AS NUMS_BUY_ORDER_h18, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020 , 1, 0)) AS NUMS_SELL_ORDER_h18, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020, Price, 100000)) AS LOWEST_PRICE_h18, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1020, Price, 0)) AS HIGHEST_PRICE_h18, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , Total, 0)), 4) as Buy_h19,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080, Total, 0)), 4) as Sell_h19, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , Total, 0))), 4) as Over_h19, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , 1, 0)) AS NUMS_BUY_ORDER_h19, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , 1, 0)) AS NUMS_SELL_ORDER_h19, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080, Price, 100000)) AS LOWEST_PRICE_h19, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1140 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080, Price, 0)) AS HIGHEST_PRICE_h19, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140 , Total, 0)), 4) as Buy_h20,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140, Total, 0)), 4) as Sell_h20, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140 , Total, 0))), 4) as Over_h20, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140 , 1, 0)) AS NUMS_BUY_ORDER_h20, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140 , 1, 0)) AS NUMS_SELL_ORDER_h20, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140, Price, 100000)) AS LOWEST_PRICE_h20, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1140, Price, 0)) AS HIGHEST_PRICE_h20, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , Total, 0)), 4) as Buy_h21,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200, Total, 0)), 4) as Sell_h21, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , Total, 0))), 4) as Over_h21, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , 1, 0)) AS NUMS_BUY_ORDER_h21, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , 1, 0)) AS NUMS_SELL_ORDER_h21, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200, Price, 100000)) AS LOWEST_PRICE_h21, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1260 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200, Price, 0)) AS HIGHEST_PRICE_h21, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260 , Total, 0)), 4) as Buy_h22,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260, Total, 0)), 4) as Sell_h22, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260 , Total, 0))), 4) as Over_h22, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260 , 1, 0)) AS NUMS_BUY_ORDER_h22, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260 , 1, 0)) AS NUMS_SELL_ORDER_h22, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260, Price, 100000)) AS LOWEST_PRICE_h22, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1260, Price, 0)) AS HIGHEST_PRICE_h22, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , Total, 0)), 4) as Buy_h23,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320, Total, 0)), 4) as Sell_h23, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , Total, 0))), 4) as Over_h23, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , 1, 0)) AS NUMS_BUY_ORDER_h23, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , 1, 0)) AS NUMS_SELL_ORDER_h23, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320, Price, 100000)) AS LOWEST_PRICE_h23, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1380 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320, Price, 0)) AS HIGHEST_PRICE_h23, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380 , Total, 0)), 4) as Buy_h24,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380, Total, 0)), 4) as Sell_h24, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380 , Total, 0))), 4) as Over_h24, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380 , 1, 0)) AS NUMS_BUY_ORDER_h24, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380 , 1, 0)) AS NUMS_SELL_ORDER_h24, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380, Price, 100000)) AS LOWEST_PRICE_h24, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1380, Price, 0)) AS HIGHEST_PRICE_h24 " +	
							 " FROM " + rows[i].TABLE_NAME + 
							 " WHERE TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440", function(err, row, fields){
													if(err) throw err;
												 	for(var i = 0; i < row.length;i++){
											        	all_rows.push(row[i]);
											        	if (i == row.length - 1){
											        		couter++;
											        	}
											  		}

				if (couter == rows.length){
					console.log('In here');
					// couter = 0;

					res.render('frame1h', {
						"projects":  all_rows
					});
					return;
				}
										
			});
		}
	});

});

module.exports = router;
