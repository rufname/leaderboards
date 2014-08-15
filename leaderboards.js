#!/bin/env node
"use strict";

module.exports = function(settings) {
	var express = require("express");
	var mongoose = require('mongoose');

	var app = express();
	
	var express_ipaddr = settings.express_ipaddr;
	var express_port = settings.express_port;
	var dbName = settings.dbName;
	var mongo_db_host = settings.mongo_db_host;
	var mongo_db_port = settings.mongo_db_port;
	var authString = "";
	if (settings.pwd !== "") {
		authString = "admin:"+settings.pwd+"@";
	}	
	var appIDs = settings.appIDs;
	
	mongoose.connect('mongodb://' + authString + mongo_db_host + ':' + mongo_db_port + '/'+dbName);

	var Schema = mongoose.Schema;  

	var Score = new Schema({  
		appID: { type: String, required: true },  
		deviceID: { type: String, required: true },
		nickname: { type: String, required: true },
		score: { type: Number, required: true },
		created_at: { type: Date, default: Date.now, required: true }
	});
	Score.index({appID: 1, deviceID: 1, nickname: 1});
	var ScoreModel = mongoose.model('Score', Score); 

	//Routes:
	//provide all scores for a given appID:
	app.get('/:appID', function (req, res){
		var appID = req.params.appID;
		if (typeof appIDs[appID] !== "undefined") {	//valid appID:
			return ScoreModel.find({appID : appID}).sort('score').exec(function (err, scores) {
						if (!err) {
							return res.status(200).json(scores);
						} else {
							console.log(err);
							return res.send(500);				
						}
					});		
		} else {		//no valid appID found:
			return res.status(404).send("not found");
		}
	});

	//provide scores for a given appID on a certain device (can be multiple nicknames):
	app.get('/:appID/:deviceID', function (req, res){
		var appID = req.params.appID;
		var deviceID = req.params.deviceID;
		if (typeof appIDs[appID] !== "undefined") {	//valid appID:
			return ScoreModel.find({appID : appID, deviceID : deviceID}).sort('score').exec(function (err, scores) {
						if (!err) {
							return res.status(200).json(scores);
						} else {
							console.log(err);
							return res.send(500);				
						}
					});		
		} else {		//no valid appID found:
			return res.status(404).send("not found");
		}
	});

	//add new score:
	app.get('/:appID/:deviceID/:nickname', function (req, res){
		//post / put / delete: req.body
		//get: requ.query
		//route: requ.params	
		var appID = req.params.appID;
		if (typeof appIDs[appID] !== "undefined") {	//valid appID:		
			var secret = req.query.secret;
			var deviceID = req.params.deviceID;
			var nickname = req.params.nickname;
			var score = req.query.score;		
			//secret, deviceID, nickname, score must be defined:
			if (typeof secret !== "undefined" &&
				typeof deviceID !== "undefined" &&
				typeof nickname !== "undefined" &&
				typeof score !== "undefined") {
				//secret must be correct and score must be a number:
				if (secret === appIDs[appID] && !isNaN(score)) {				
					//valid request => create new score entry:
					var newScore = new ScoreModel({
						appID: appID,
						deviceID : deviceID,
						nickname : nickname,									
						score: score
					});
					newScore.save(function (err) {
						if (!err) {
							return res.status(201).send("valid request. created");
						} else {
							console.log(err);
							return res.status(500).send("Internal server error");
						}
					});
				} else {		//wrong secret for this appID:
					return res.status(404).send("invalid request.");	
				}
			} else {
				return res.status(404).send("invalid request.");	
			}
		} else {		//no valid appID found:
			return res.status(404).send("invalid request.");
		}
	});

	return {
		start :	function (dates, excludeBurstsOnce) {
			// Launch server:
			app.listen(express_port, express_ipaddr, function(){
					var d = new Date();
					console.log("Express server listening... " + d);
				});		
		}
	};
};