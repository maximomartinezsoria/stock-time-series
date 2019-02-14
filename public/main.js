'use strict'

// Request to the node server every 5 minutes
request();
setInterval(request, 5 * 1000 * 60);

function request(){
    fetch('http://localhost:3000/data')
    .then(data => data.json()) 
    .then(data => {
        var data = data.data["Time Series (5min)"];
        console.log(data);
        chart(data);
    })
    .catch(err => console.log('the error: ' + err));
}


function chart(data) {
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = []
    
    for(let series in data) {
        if(data.hasOwnProperty(series)){
            ohlc.push([
                parseFloat(series), // the date
                parseFloat(data[series]["1. open"]), // open
                parseFloat(data[series]["2. high"]), // high
                parseFloat(data[series]["3. low"]), // low
                parseFloat(data[series]["4. close"]) // close
            ]);

            volume.push([
                parseFloat(series), // the date
                parseFloat(data[series]["5. volume"]) // the volume
            ]);
        }
    }

    Highcharts.stockChart('container', {
        yAxis: [{
            labels: {
                align: 'right'
            },
            height: '80%',
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        tooltip: {
            shape: 'square',
            headerShape: 'callout',
            borderWidth: 0,
            shadow: false,
            positioner: function (width, height, point) {
                var chart = this.chart,
                    position;

                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            chart.plotLeft,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: point.plotY
                    };
                } else {
                    position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop
                    };
                }

                return position;
            }
        },
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc
        }, {
            type: 'column',
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
}