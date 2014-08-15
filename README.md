leaderboards
============

A node.js module that creates a leaderboard server based on express.js and MongoDB.
It accepts new scores and delivers leaderboards in JSON format via HTTP.
The leaderboard server can be used with any device type (i.e. iOS, Android, HTML/Javascript), as long as the device can make HTTP requests to set and retrieve scores. The combination of a deviceID and a nickname is the unique key under which the scores are saved. So the application needs to create a unique deviceID and get the users nickname.


## Installation

`npm install leaderboards`

## Usage
```js
var Leaderboard = require("leaderboards");

var settings = {
	express_ipaddr : process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
	express_port : process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	dbName : "leaderboards",
	mongo_db_host : process.env.OPENSHIFT_MONGODB_DB_HOST || "127.0.0.1",
	mongo_db_port : process.env.OPENSHIFT_MONGODB_DB_PORT || 27018,
	pwd : "password",
	appIDs : {		
		"pipelinemanager" : "apple",		//appID : secret
		"messageontheblock" : "pie"
	}
};

var lb = new Leaderboard(settings);
lb.start();
```
This code creates and starts a leaderboard server that handles highscores for two applications (i.e. two leaderboards): "pipelinemanager" and "messageontheblock". The server expects a secret to authorize API requests for each application that wants to add a new score.

## API

### Add a new score

Make a simple HTTP GET request like this:

`GET http://serverName.com/appID/deviceID/nickname?secret=yourSecret&score=userScore`

**Required parameters:**

> **serverName** .. the address under which the leaderboard server is running
**appID** .. as defined in the leaderboard server settings
**secret** .. as defined in the leaderboard server settings
**deviceID** .. an ID for each device where the application is running, defined by yourself
**nickname** .. nickname associated to the score
**score** .. the new score to be added


### Retrieve a leaderboard

Make a simple HTTP GET request like this:

`GET http://serverName.com/appID`

**Required parameters:**

> **serverName** .. the address under which the leaderboard server is running
**appID** .. as defined in the leaderboard server settings

**Result example:**

```json
[
  {
    "_id": "53eca8c7c09d6a6c13d624ca",
    "appID": "pipelinemanager",
    "deviceID": "0815sdasdfg",
    "nickname": "Tom",
    "score": 20,
    "__v": 0,
    "created_at": "2014-08-14T12:17:11.671Z"
  },
  {
    "_id": "53eca8aec09d6a6c13d624c7",
    "appID": "pipelinemanager",
    "deviceID": "0815sdasdfg",
    "nickname": "Tom",
    "score": 129,
    "__v": 0,
    "created_at": "2014-08-14T12:16:46.767Z"
  },
  {
    "_id": "53eca8b4c09d6a6c13d624c8",
    "appID": "pipelinemanager",
    "deviceID": "0815sdasdfg",
    "nickname": "Julia",
    "score": 200,
    "__v": 0,
    "created_at": "2014-08-14T12:16:52.348Z"
  },
  {
    "_id": "53eca8c3c09d6a6c13d624c9",
    "appID": "pipelinemanager",
    "deviceID": "0815sdasdfg",
    "nickname": "Julia",
    "score": 2000,
    "__v": 0,
    "created_at": "2014-08-14T12:17:07.290Z"
  },
  {
    "_id": "53eca8d9c09d6a6c13d624cb",
    "appID": "pipelinemanager",
    "deviceID": "ffdgdfgdfg",
    "nickname": "Maria",
    "score": 1523,
    "__v": 0,
    "created_at": "2014-08-14T12:17:29.273Z"
  },
  {
    "_id": "53eca8fcc09d6a6c13d624cc",
    "appID": "pipelinemanager",
    "deviceID": "ffdgdfgdfg",
    "nickname": "Maria",
    "score": 2052,
    "__v": 0,
    "created_at": "2014-08-14T12:18:04.217Z"
  }
]
```