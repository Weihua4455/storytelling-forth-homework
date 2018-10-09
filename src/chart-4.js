import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 200

let radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([30, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(d => radiusScale(d.high_temp))
  .innerRadius(d => radiusScale(d.low_temp))
  .angle(d => angleScale(d.month_name))

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  // console.log(datapoints)

  let bands = [20, 30, 40, 50, 60, 70, 80, 90]
  let bandShow = [30, 50, 70, 90]

  let months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  var container = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  container
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    // .attr('fill', 'rgba(255, 0, 0, 0.5)')
    .attr('fill', 'lightblue')
    .attr('opacity', 0.8)
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
    .text(d => d + '° F')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)

  container
    .append('text')
    .text('NYC')
    .attr('x', 0)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .attr('font-size', 45)
    .attr('font-weight', 600)
    .attr('alignment-baseline', 'middle')
}
