import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

var radiusScale = d3.scaleLinear().range([0, 90])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))

// var labelArc = d3
//   .arc()
//   .innerRadius(0)
//   .outerRadius(d => radiusScale(d.data.high_temp) + 20)

var colorScale = d3
  .scaleQuantize()
  .range(['#b6d5e3', '#bed3e0', '#cfcedb', '#dfcad6', '#f0c5d0', '#fdc0cc'])

var xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  // console.log(nested)

  var keys = nested.map(d => d.key)
  xPositionScale.domain(keys)

  let allTemp = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(allTemp))
  radiusScale.domain([0, d3.max(allTemp)])

  svg
    .selectAll('.chart-3b-graph')
    .data(nested)
    .enter()
    .each(function(d) {
      var graphX = xPositionScale(d.key) + 90

      var container = d3
        .select(this)
        .append('g')
        .attr('transform', `translate(${graphX},${height / 2})`)

      container
        .selectAll('.chart-3b-path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('class', 'chart-3b-path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.high_temp))

      container
        .append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('font-size', 20)
        .attr('dy', 120)
        .attr('font-weight', 600)

      // container
      //   .selectAll('.chart-3-pie-text')
      //   .data(pie(d.values))
      //   .enter()
      //   .append('text')
      //   .text(d => d.data.month_name)
      //   .attr('x', d => {
      //     // console.log(labelArc.centroid(d)[0])
      //
      //     return labelArc.centroid(d)[0]
      //   })
      //   .attr('y', d => {
      //     return labelArc.centroid(d)[1]
      //   })
      //   .attr('transform', function(d) {
      //     return 'translate(' + labelArc.centroid(d) + ')'
      //   })
      //   .attr('text-anchor', function(d) {
      //     if (d.startAngle > Math.PI) {
      //       return 'end'
      //     } else {
      //       return 'start'
      //     }
      //   })

      container
        .append('circle')
        .attr('r', 2.5)
        .attr('x', 0)
        .attr('y', 0)
    })
}
