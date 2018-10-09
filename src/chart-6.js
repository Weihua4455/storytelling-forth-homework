import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 400 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 160

let radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.score))
  .angle(d => angleScale(d.category))

d3.csv(require('./data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  let bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

  let categories = datapoints.map(d => d.category)
  angleScale.domain(categories)

  // console.log(datapoints)

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
    .attr('stroke', 'black')
    .attr('stroke-opacity', 1)
    .attr('stroke-width', 1)

  container
    .selectAll('.label-line')
    .data(datapoints)
    .enter()
    .append('line')
    .attr('class', 'label-line')
    .attr('x0', 0)
    .attr('y0', 0)
    .attr('x1', d => {
      let r = radiusScale(5)
      let a = angleScale(d.category)

      return Math.sin(a) * r
    })
    .attr('y1', d => {
      let r = radiusScale(5)
      let a = angleScale(d.category)

      return Math.cos(a) * r * -1
    })
    .attr('stroke', 'lightgray')
    .attr('stroke-width', 1)
    .lower()

  container
    .selectAll('.lable-text')
    .data(datapoints)
    .enter()
    .append('text')
    .attr('class', 'label-text')
    .text(d => d.category)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('transform', d => {
      let r = radiusScale(5.5)
      let a = angleScale(d.category)

      let xPosition = Math.sin(a) * r
      let yPosition = Math.cos(a) * r * -1
      let rotation = (a / Math.PI) * 180
      return `translate(${xPosition}, ${yPosition})rotate(${rotation})`
    })

  container
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'lightgray')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()
}
