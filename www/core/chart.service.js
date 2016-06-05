(function(){

'use strict'

angular
  .module('SenseIt.core')
  .factory("chartFactory", chartFactory)

  chartFactory.$inject = [];

function chartFactory(){

  var chart1;

  //configuration
var chartValues = function(series, chartTitle,yAxisData){

chart1 = new Highcharts.Chart({
            chart: {
                zoomType: 'x',
                renderTo: 'chart-container'
            },
            title: {
                text: chartTitle
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: yAxisData
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: series
        });

};


var addSerie = function(serie){
    chart1.addSeries(serie,true)
}

var reDraw = function(){
    console.log("redraw")
    chart1.redraw();
}


   return {
     chartValues: chartValues,
     addSerie: addSerie,
//      reDraw: reDraw
   }


  }




})()
