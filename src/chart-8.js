import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 150

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.value / d.max))
  .angle(d => angleScale(d.name))

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // console.log(datapoints)

  let player = datapoints[0]

  let leBron = [
    { name: 'Minutes', value: player.MP, max: 60 },
    { name: 'Points', value: player.PTS, max: 30 },
    { name: 'Field Goals', value: player.FG, max: 10 },
    { name: '3-Point Field Goals', value: player.ThreeP, max: 5 },
    { name: 'Free Throws', value: player.FT, max: 10 },
    { name: 'Rebounds', value: player.TRB, max: 15 },
    { name: 'Assists', value: player.AST, max: 10 },
    { name: 'Steals', value: player.STL, max: 5 },
    { name: 'Blocks', value: player.BLK, max: 5 }
  ]

  leBron.push(leBron[0])

  // console.log(leBron)

  let categories = leBron.map(d => d.name)
  angleScale.domain(categories)

  let bands = [0.2, 0.4, 0.6, 0.8, 1]

  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  container
    .datum(leBron)
    .append('mask')
    .attr('id', 'color-mask')
    .append('path')
    .attr('fill', 'white')
    .attr('d', line)

  container
    .selectAll('.scale-band-shape')
    .data(bands.reverse())
    .enter()
    .append('circle')
    .attr('class', 'scale-band-shape')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      // console.log('Looking at circle number', i)
      if (i % 2 === 0) {
        return '#c94435'
      } else {
        return '#FFB81C'
      }
    })
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('mask', 'url(#color-mask)')

  container
    .selectAll('.lable-text')
    .data(leBron)
    .enter()
    .append('text')
    .attr('class', 'label-text')
    .text(d => d.name)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('font-size', 13)
    .attr('alignment-baseline', 'middle')
    .attr('transform', d => {
      let r = radius + 14
      let a = angleScale(d.name)

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
    .attr('class', 'scale-band')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      // console.log('Looking at circle number', i)
      if (i % 2 === 0) {
        return '#e8e7e5'
      } else {
        return '#f6f6f6'
      }
    })
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  d3.selectAll('.scale-band').each(function(percentage, i) {
    // console.log(percentage)
    container
      .selectAll('.label-tick')
      .data(leBron)
      .enter()
      .append('text')
      .text(d => d.max * percentage)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('alignment-baseline', 'middle')
      .attr('transform', d => {
        let r = radiusScale(percentage)
        let a = angleScale(d.name)

        let xPosition = Math.sin(a) * r
        let yPosition = Math.cos(a) * r * -1
        let rotation = (a / Math.PI) * 180
        return `translate(${xPosition}, ${yPosition})rotate(${rotation})`
      })
  })

  // container
  //   .append('path')
  //   .datum(leBron)
  //   .attr('d', line)
  //   // .attr('fill', 'rgba(255, 0, 0, 0.5)')
  //   .attr('fill', 'none')
  //   .attr('opacity', 0.8)
  //   .attr('stroke', 'none')

  container
    .append('text')
    .attr('font-weight', '600')
    .attr('text-anchor', 'middle')
    .attr('font-size', 25)
    .attr('alignment-baseline', 'middle')
    .text('LeBron James')
    .attr('y', -radiusScale(1) - 70)

  container
    .append('text')
    .attr('font-weight', '600')
    .attr('text-anchor', 'middle')
    .attr('font-size', 15)
    .attr('alignment-baseline', 'middle')
    .text('Cleveland Cavaliers')
    .attr('y', -radiusScale(1) - 50)
}
