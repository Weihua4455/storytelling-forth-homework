import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radiusScale = d3.scaleLinear().range([30, 80])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var xPositionScale = d3.scaleBand().range([0, width])

var line = d3
  .radialArea()
  .outerRadius(d => radiusScale(d.high_temp))
  .innerRadius(d => radiusScale(d.low_temp))
  .angle(d => angleScale(d.month_name))

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
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
  radiusScale.domain([0, d3.max(allTemp)])

  let bands = [20, 40, 60, 80, 100]
  let bandShow = [20, 60, 100]

  let months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('text-anchor', 'middle')
    .attr('font-size', 40)
    .attr('font-weight', 'bold')
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('dy', 25)

  svg
    .append('text')
    .text('in cities around the world')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .attr('font-weight', 600)
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('dy', 60)

  svg
    .selectAll('.chart-3c-graph')
    .data(nested)
    .enter()
    .each(function(d) {
      var graphX = xPositionScale(d.key) + 90

      var container = d3
        .select(this)
        .append('g')
        .attr('transform', `translate(${graphX},${height / 2})`)

      d.values.push(d.values[0])

      container
        .append('path')
        .datum(d.values)
        .attr('d', line)
        // .attr('fill', 'rgba(255, 0, 0, 0.5)')
        .attr('fill', 'red')
        .attr('opacity', 0.3)
        .attr('stroke', 'none')

      container
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'darkgrey')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      container
        .selectAll('.scale-text')
        .data(bandShow)
        .enter()
        .append('text')
        .text(d => d)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))

      container
        .append('text')
        .text(d.key)
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('font-size', 15)
        .attr('font-weight', 600)
        .attr('alignment-baseline', 'middle')
      // console.log(d.values)
    })
}
