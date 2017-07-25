exports.handler = function(event, context, callback) {
    "use strict";
    var AWS = require("aws-sdk"),
        graph = require('fbgraph'),
        fbad = require("./getAdStatus"),
        _ = require("underscore"),
        config = require('config'),
        filelist = [],
        AdAccount = {},
        rowCount = 0;

    AWS.config.update({
        region: config.get('region'),
        "accessKeyId": config.get('accessKeyId'),
        "secretAccessKey": config.get('secretAccessKey')
    });

    graph.setVersion(config.get('version'));
    graph.setAccessToken(config.get('accessToken'));

    var api_str = "/me/adaccounts";
    var ad_data = '';
    graph.get(api_str, function(err, res) {

        if (err) {
            return console.error(err);
        }

        _.each(res.data, function(key) {
            fbad.getAdStatus({
                "ad_acct": key.id,
                "fbob": graph
            }, function(error, keys) {
                if (error) {
                    console.log('Some Error Occurred');
                    return console.error(error);
                }
                filelist = []
                _.each(keys, function(keya) {
                    if (keya.status == "ACTIVE") {
                        keya['date'] = getDateTime();
                        filelist.push(keya);
                    }
                });
                rowCount += 1;
                if (filelist.length > 0) {
                    AdAccount[key.id] = filelist;
                }

                if (rowCount == res.data.length) {
                    callback(null, AdAccount);
                }

            });

        });
        console.log('Success');
    });



}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;


    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}