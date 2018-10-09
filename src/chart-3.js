import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

var radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, 200])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp))

var labelArc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.data.high_temp) + 20)

var colorScale = d3
  .scaleQuantize()
  .range(['#b6d5e3', '#bed3e0', '#cfcedb', '#dfcad6', '#f0c5d0', '#fdc0cc'])

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)
  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let allTemp = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(allTemp))

  // console.log(colorScale(40))

  container
    .selectAll('.chart-3-path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('class', 'chart-3-path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.high_temp))

  container
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)
    .attr('dy', -150)
    .attr('font-weight', 600)

  container
    .selectAll('.chart-3-pie-text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.month_name)
    .attr('x', d => {
      // console.log(labelArc.centroid(d)[0])

      return labelArc.centroid(d)[0]
    })
    .attr('y', d => {
      return labelArc.centroid(d)[1]
    })
    .attr('transform', function(d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .attr('text-anchor', function(d) {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })

  container
    .append('circle')
    .attr('r', 2.5)
    .attr('x', 0)
    .attr('y', 0)
  // console.log(datapoints)
}
