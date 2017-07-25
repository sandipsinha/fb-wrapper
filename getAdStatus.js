module.exports = {

    getAdStatus: function(options, callback) {

        graph = options.fbob;
        var params = {
            fields: "id, account_id,name, adset_id, campaign_id,status"
        };
        var api_str = "/" + options.ad_acct + "/ads";
        graph.get(api_str, params, function(err, res) {
            if (err) {
                callback(null, '');
            }

            callback(null, res.data);
        });

    }

}

 