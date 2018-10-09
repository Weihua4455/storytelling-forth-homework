import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3
  .pie()
  .value(function(d) {
    return d.minutes
  })
  .sort(null)

var radius = 70

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3.scaleOrdinal().range(['#fc8d59', '#ffffbf', '#91bfdb'])

var xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // console.log('datapoints look like: ', datapoints)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  // console.log('nested data look like: ', nested)
  var keys = nested.map(d => d.key)
  xPositionScale.domain(keys)

  // console.log(keys)
  svg
    .selectAll('.pie-graph')
    .data(nested)
    .enter()
    .each(function(d) {
      var graphX = xPositionScale(d.key) + 90

      var container = d3
        .select(this)
        .append('g')
        .attr('transform', `translate(${graphX},${height / 2})`)

      // console.log(d)
      // console.log(graphX)

      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      container
        .datum(d)
        .append('text')
        .text(d.key)
        .attr('y', 90)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
    })
}
