const path = require('path');
const express = require('express');
const fetch = require("node-fetch");
const CacheService = require('./services/cache.service');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Run the server.
const server = app.listen(3000, () => {
    var port = server.address().port
    console.log('server is runnning in port ' + port + '!');

    app.get('/data', function (req, res) {
        
        // Start the cache
        var time = 60 * 5; // 5 min 
        const cache = new CacheService(time);
    
        // doing the request at the beggining
        function doingRequest(){
            // if the request is already in cache, remove it.
            if(cache.exist(1)){
                cache.del(1);
            }
        
            // caching the request
            cache.get(1, () => {
                var apiKey = 'ITKORAERP00Y0RL6';
                var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=' + apiKey;
                
                // Doing the request to alphavantage API
                    console.log('DOING THE REQUEST');
                    return fetch(url)
                    .then(data => data.json())
                    .then(data => {
                        res.status(200).send({data}); // Sending the data to the frontend
                    })
                    // catching and showing errors
                    .catch(function (e) {
                        console.error(e)
                        res.status(500).send({message: 'There was an error'});
                    });
            });
        }

        doingRequest();
        // doing the request every five minutes
        setInterval(doingRequest, 5 * 60 * 1000);
    });
});