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

	connection.query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'bittrex_data';", function(err, rows, fields){
		if(err) throw err;
		max = rows.length;
	 	for(var i = 0; i < rows.length;i++){
			connection.query("SELECT '" + rows[i].TABLE_NAME + "' as Market," + 
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , Total, 0)), 4) as Buy_h2,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0, Total, 0)), 4) as Sell_h2, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , Total, 0))), 4) as Over_h2, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , 1, 0)) AS NUMS_BUY_ORDER_h2, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0 , 1, 0)) AS NUMS_SELL_ORDER_h2, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0, Price, 100000)) AS LOWEST_PRICE_h2, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 120 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=0, Price, 0)) AS HIGHEST_PRICE_h2, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , Total, 0)), 4) as Buy_h4,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120, Total, 0)), 4) as Sell_h4, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , Total, 0))), 4) as Over_h4, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , 1, 0)) AS NUMS_BUY_ORDER_h4, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120 , 1, 0)) AS NUMS_SELL_ORDER_h4, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120, Price, 100000)) AS LOWEST_PRICE_h4, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 240 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=120, Price, 0)) AS HIGHEST_PRICE_h4, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , Total, 0)), 4) as Buy_h6,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240, Total, 0)), 4) as Sell_h6, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , Total, 0))), 4) as Over_h6, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , 1, 0)) AS NUMS_BUY_ORDER_h6, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240 , 1, 0)) AS NUMS_SELL_ORDER_h6, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240, Price, 100000)) AS LOWEST_PRICE_h6, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 360 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=240, Price, 0)) AS HIGHEST_PRICE_h6, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , Total, 0)), 4) as Buy_h8,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360, Total, 0)), 4) as Sell_h8, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , Total, 0))), 4) as Over_h8, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , 1, 0)) AS NUMS_BUY_ORDER_h8, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360 , 1, 0)) AS NUMS_SELL_ORDER_h8, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360, Price, 100000)) AS LOWEST_PRICE_h8, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 480 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=360, Price, 0)) AS HIGHEST_PRICE_h8, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , Total, 0)), 4) as Buy_h10,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480, Total, 0)), 4) as Sell_h10, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , Total, 0))), 4) as Over_h10, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , 1, 0)) AS NUMS_BUY_ORDER_h10, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480 , 1, 0)) AS NUMS_SELL_ORDER_h10, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480, Price, 100000)) AS LOWEST_PRICE_h10, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 600 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=480, Price, 0)) AS HIGHEST_PRICE_h10, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , Total, 0)), 4) as Buy_h12,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600, Total, 0)), 4) as Sell_h12, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , Total, 0))), 4) as Over_h12, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , 1, 0)) AS NUMS_BUY_ORDER_h12, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600 , 1, 0)) AS NUMS_SELL_ORDER_h12, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600, Price, 100000)) AS LOWEST_PRICE_h12, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 720 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=600, Price, 0)) AS HIGHEST_PRICE_h12, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , Total, 0)), 4) as Buy_h14,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720, Total, 0)), 4) as Sell_h14, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , Total, 0))), 4) as Over_h14, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , 1, 0)) AS NUMS_BUY_ORDER_h14, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720 , 1, 0)) AS NUMS_SELL_ORDER_h14, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720, Price, 100000)) AS LOWEST_PRICE_h14, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 840 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=720, Price, 0)) AS HIGHEST_PRICE_h14, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , Total, 0)), 4) as Buy_h16,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840, Total, 0)), 4) as Sell_h16, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , Total, 0))), 4) as Over_h16, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , 1, 0)) AS NUMS_BUY_ORDER_h16, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840 , 1, 0)) AS NUMS_SELL_ORDER_h16, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840, Price, 100000)) AS LOWEST_PRICE_h16, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 960 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=840, Price, 0)) AS HIGHEST_PRICE_h16, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , Total, 0)), 4) as Buy_h18,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960, Total, 0)), 4) as Sell_h18, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , Total, 0))), 4) as Over_h18, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , 1, 0)) AS NUMS_BUY_ORDER_h18, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960 , 1, 0)) AS NUMS_SELL_ORDER_h18, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960, Price, 100000)) AS LOWEST_PRICE_h18, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1080 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=960, Price, 0)) AS HIGHEST_PRICE_h18, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , Total, 0)), 4) as Buy_h20,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080, Total, 0)), 4) as Sell_h20, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , Total, 0))), 4) as Over_h20, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , 1, 0)) AS NUMS_BUY_ORDER_h20, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080 , 1, 0)) AS NUMS_SELL_ORDER_h20, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080, Price, 100000)) AS LOWEST_PRICE_h20, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1200 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1080, Price, 0)) AS HIGHEST_PRICE_h20, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , Total, 0)), 4) as Buy_h22,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200, Total, 0)), 4) as Sell_h22, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , Total, 0))), 4) as Over_h22, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , 1, 0)) AS NUMS_BUY_ORDER_h22, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200 , 1, 0)) AS NUMS_SELL_ORDER_h22, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200, Price, 100000)) AS LOWEST_PRICE_h22, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1320 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1200, Price, 0)) AS HIGHEST_PRICE_h22, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , Total, 0)), 4) as Buy_h24,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320, Total, 0)), 4) as Sell_h24, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , Total, 0))), 4) as Over_h24, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , 1, 0)) AS NUMS_BUY_ORDER_h24, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320 , 1, 0)) AS NUMS_SELL_ORDER_h24, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320, Price, 100000)) AS LOWEST_PRICE_h24, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1440 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1320, Price, 0)) AS HIGHEST_PRICE_h24, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440 , Total, 0)), 4) as Buy_h26,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440, Total, 0)), 4) as Sell_h26, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440 , Total, 0))), 4) as Over_h26, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440 , 1, 0)) AS NUMS_BUY_ORDER_h26, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440 , 1, 0)) AS NUMS_SELL_ORDER_h26, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440, Price, 100000)) AS LOWEST_PRICE_h26, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1560 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1440, Price, 0)) AS HIGHEST_PRICE_h26, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560 , Total, 0)), 4) as Buy_h28,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560, Total, 0)), 4) as Sell_h28, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560 , Total, 0))), 4) as Over_h28, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560 , 1, 0)) AS NUMS_BUY_ORDER_h28, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560 , 1, 0)) AS NUMS_SELL_ORDER_h28, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560, Price, 100000)) AS LOWEST_PRICE_h28, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1680 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1560, Price, 0)) AS HIGHEST_PRICE_h28, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680 , Total, 0)), 4) as Buy_h30,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680, Total, 0)), 4) as Sell_h30, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680 , Total, 0))), 4) as Over_h30, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680 , 1, 0)) AS NUMS_BUY_ORDER_h30, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680 , 1, 0)) AS NUMS_SELL_ORDER_h30, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680, Price, 100000)) AS LOWEST_PRICE_h30, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1800 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1680, Price, 0)) AS HIGHEST_PRICE_h30, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800 , Total, 0)), 4) as Buy_h32,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800, Total, 0)), 4) as Sell_h32, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800 , Total, 0))), 4) as Over_h32, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800 , 1, 0)) AS NUMS_BUY_ORDER_h32, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800 , 1, 0)) AS NUMS_SELL_ORDER_h32, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800, Price, 100000)) AS LOWEST_PRICE_h32, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 1920 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1800, Price, 0)) AS HIGHEST_PRICE_h32, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920 , Total, 0)), 4) as Buy_h34,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920, Total, 0)), 4) as Sell_h34, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920 , Total, 0))), 4) as Over_h34, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920 , 1, 0)) AS NUMS_BUY_ORDER_h34, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920 , 1, 0)) AS NUMS_SELL_ORDER_h34, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920, Price, 100000)) AS LOWEST_PRICE_h34, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2040 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=1920, Price, 0)) AS HIGHEST_PRICE_h34, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040 , Total, 0)), 4) as Buy_h36,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040, Total, 0)), 4) as Sell_h36, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040 , Total, 0))), 4) as Over_h36, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040 , 1, 0)) AS NUMS_BUY_ORDER_h36, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040 , 1, 0)) AS NUMS_SELL_ORDER_h36, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040, Price, 100000)) AS LOWEST_PRICE_h36, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2160 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2040, Price, 0)) AS HIGHEST_PRICE_h36, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160 , Total, 0)), 4) as Buy_h38,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160, Total, 0)), 4) as Sell_h38, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160 , Total, 0))), 4) as Over_h38, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160 , 1, 0)) AS NUMS_BUY_ORDER_h38, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160 , 1, 0)) AS NUMS_SELL_ORDER_h38, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160, Price, 100000)) AS LOWEST_PRICE_h38, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2280 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2160, Price, 0)) AS HIGHEST_PRICE_h38, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280 , Total, 0)), 4) as Buy_h40,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280, Total, 0)), 4) as Sell_h40, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280 , Total, 0))), 4) as Over_h40, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280 , 1, 0)) AS NUMS_BUY_ORDER_h40, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280 , 1, 0)) AS NUMS_SELL_ORDER_h40, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280, Price, 100000)) AS LOWEST_PRICE_h40, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2400 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2280, Price, 0)) AS HIGHEST_PRICE_h40, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400 , Total, 0)), 4) as Buy_h42,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400, Total, 0)), 4) as Sell_h42, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400 , Total, 0))), 4) as Over_h42, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400 , 1, 0)) AS NUMS_BUY_ORDER_h42, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400 , 1, 0)) AS NUMS_SELL_ORDER_h42, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400, Price, 100000)) AS LOWEST_PRICE_h42, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2520 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2400, Price, 0)) AS HIGHEST_PRICE_h42, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520 , Total, 0)), 4) as Buy_h44,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520, Total, 0)), 4) as Sell_h44, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520 , Total, 0))), 4) as Over_h44, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520 , 1, 0)) AS NUMS_BUY_ORDER_h44, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520 , 1, 0)) AS NUMS_SELL_ORDER_h44, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520, Price, 100000)) AS LOWEST_PRICE_h44, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2640 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2520, Price, 0)) AS HIGHEST_PRICE_h44, " +
							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640 , Total, 0)), 4) as Buy_h46,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640, Total, 0)), 4) as Sell_h46, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640 , Total, 0))), 4) as Over_h46, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640 , 1, 0)) AS NUMS_BUY_ORDER_h46, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640 , 1, 0)) AS NUMS_SELL_ORDER_h46, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640, Price, 100000)) AS LOWEST_PRICE_h46, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2760 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2640, Price, 0)) AS HIGHEST_PRICE_h46, " +
 							 "ROUND(SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760 , Total, 0)), 4) as Buy_h48,  ROUND(SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760, Total, 0)), 4) as Sell_h48, ROUND((SUM(IF(OrderType='BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760 , Total, 0)) - SUM(IF(OrderType='SELL' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760 , Total, 0))), 4) as Over_h48, SUM(IF(OrderType = 'BUY' AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760 , 1, 0)) AS NUMS_BUY_ORDER_h48, SUM(IF(OrderType = 'SELL'  AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760 , 1, 0)) AS NUMS_SELL_ORDER_h48, MIN(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760, Price, 100000)) AS LOWEST_PRICE_h48, MAX(IF(TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) < 2880 AND TIMESTAMPDIFF(MINUTE,TimeStamp,UTC_TIMESTAMP()) >=2760, Price, 0)) AS HIGHEST_PRICE_h48 " +
							 " FROM " + rows[i].TABLE_NAME, function(err, row, fields){
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

					res.render('frame2h', {
						"projects":  all_rows
					});
				}
										
			});
		}
	});

});

module.exports = router;
