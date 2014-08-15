#!/bin/env node
"use strict";

var Leaderboard = require("./leaderboards");

var settings = {
	express_ipaddr : process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
	express_port : process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	dbName : "leaderboards",
	mongo_db_host : process.env.OPENSHIFT_MONGODB_DB_HOST || "127.0.0.1",
	mongo_db_port : process.env.OPENSHIFT_MONGODB_DB_PORT || 27018,
	pwd : "",
	appIDs : {
		//deviceID : secret
		"pipelinemanager" : "apple",
		"messageontheblock" : "pie"
	}
};

var lb = new Leaderboard(settings);

lb.start();

