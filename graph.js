var lightData = [];
var tempData = [];
var soundData = [];

parseTime = d3.timeParse("%H:%M:%S");

lightData.forEach(function(d) {
  d.Time = parseTime(d.Time);
  d.Light = +d.Light
});

// Make the graph
var svg = d3.select(".lightgraph"),
  margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  main = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tgraph = d3.select(".tempgraph")
  tmargin = {top: 20, right: 20, bottom: 30, left: 50},
  twidth = +tgraph.attr("width") - tmargin.left - tmargin.right,
  theight = +tgraph.attr("height") - tmargin.top - tmargin.bottom,
  tempgraph = tgraph.append("g").attr("transform", "translate(" + tmargin.left + "," + tmargin.top + ")");

var sgraph = d3.select(".soundgraph")
  smargin = {top: 20, right: 20, bottom: 30, left: 50},
  swidth = +sgraph.attr("width") - smargin.left - smargin.right,
  sheight = +sgraph.attr("height") - smargin.top - smargin.bottom,
  soundgraph = sgraph.append("g").attr("transform", "translate(" + smargin.left + "," + smargin.top + ")");

// Get range of data
function getLightRange() {
  var result =  d3.extent(lightData, function(d) {return d.Light})
  result[0] = result[0] * .8
  result[1] = result[1] * 1.1
  return result
}

function getTempRange() {
  var result = d3.extent(tempData, function(d) {return d.Temp})
  result[0] = result[0] * .8
  result[1] = result[1] * 1.1
  return result
}

function getSoundRange() {
  var result = d3.extent(soundData, function(d) {return d.Sound})
  result[0] = result[0] * .8
  result[1] = result[1] * 1.1
  return result
}

var xlight = d3.scaleLinear().domain(d3.extent(lightData, function(d){return d.Time})).rangeRound([0,width]);
var ylight = d3.scaleLinear().domain(getLightRange()).rangeRound([height, 0]);

var xtemp = d3.scaleLinear().domain(d3.extent(tempData, function(d){return d.Time})).rangeRound([0,twidth]);
var ytemp = d3.scaleLinear().domain(getTempRange()).rangeRound([theight, 0]);

var xsound = d3.scaleLinear().domain(d3.extent(soundData, function(d){return d.Sound})).rangeRound([0,swidth]);
var ysound = d3.scaleLinear().domain(getSoundRange()).rangeRound([sheight, 0]);

var yaxis = d3.axisLeft(ylight),
  ytaxis = d3.axisLeft(ytemp),
  ysaxis = d3.axisLeft(ysound);
var xaxis = d3.axisBottom(xlight).tickFormat(d3.timeFormat("%I:%M:%S")),
  xtaxis = d3.axisBottom(xtemp).tickFormat(d3.timeFormat("%I:%M:%S")),
  xsaxis = d3.axisBottom(xsound).tickFormat(d3.timeFormat("%I:%M:%S"));

main.append("g").attr("class", "yaxis").call(yaxis);
main.append("g").attr("class", "xaxis").attr("transform", "translate(0," + height + ")").call(xaxis);
tempgraph.append("g").attr("class", "ytaxis").call(ytaxis);
tempgraph.append("g").attr("class", "xtaxis").attr("transform", "translate(0," + theight + ")").call(xtaxis);
soundgraph.append("g").attr("class", "ysaxis").call(ysaxis);
soundgraph.append("g").attr("class", "xsaxis").attr("transform", "translate(0," + sheight + ")").call(xsaxis);

var lightLine = d3.line()
  .x(function(d) {return xlight(d.Time)})
  .y(function(d) {return ylight(d.Light)});

var tempLine = d3.line()
  .x(function(d) {return xtemp(d.Time)})
  .y(function(d) {return ytemp(d.Temp)});

var soundLine = d3.line()
  .x(function(d) {return xsound(d.Time)})
  .y(function(d) {return ysound(d.Sound)});


main.append("path")
  .datum(lightData)
  .attr("stroke", "black")
  .attr("fill", "None")
  .attr("stroke-width", 1.5)
  .attr("d", lightLine)
  .attr("class", "line lightline");

tempgraph.append("path")
  .datum(tempData)
  .attr("stroke", "black")
  .attr("fill", "None")
  .attr("stroke-width", 1.5)
  .attr("d", tempLine)
  .attr("class", "line templine");

soundgraph.append("path")
  .datum(soundData)
  .attr("stroke", "black")
  .attr("fill", "None")
  .attr("stroke-width", 1.5)
  .attr("d", soundLine)
  .attr("class", "line soundline");

function updateLight(light) {
  // Push new light data
  console.log(parseTime(moment().format('hh:mm:ss')));
  lightData.push({
    "Time": parseTime(moment().format('hh:mm:ss')),
    "Light": light
  });
  // redefine axes
  xlight.domain(d3.extent(lightData, function(d){return d.Time}))
  ylight.domain(getLightRange())

  // Redefine paths
  lightLine = d3.line()
  .x(function(d) {return xlight(d.Time)})
  .y(function(d) {return ylight(d.Light)});

  var trans_dur = 100;
  var t = d3.transition().duration(trans_dur).ease(d3.easeLinear)
  main.selectAll("path.lightline").datum(lightData).transition(t).attr("d", lightLine);
  main.selectAll("g.yaxis").transition(t).call(yaxis)
  main.selectAll("g.xaxis").transition(t).call(xaxis)

}
function updateTemp(temp) {

  tempData.push({
    "Time": parseTime(moment().format('hh:mm:ss')),
    "Temp": temp
  });
  // redefine axes
  xtemp.domain(d3.extent(tempData, function(d){return d.Time}))
  ytemp.domain(getTempRange())

  // Redefine paths
  tempLine = d3.line()
  .x(function(d) {return xtemp(d.Time)})
  .y(function(d) {return ytemp(d.Temp)});

  var trans_dur = 100;
  var t = d3.transition().duration(trans_dur).ease(d3.easeLinear)
  tempgraph.selectAll("path.templine").datum(tempData).transition(t).attr("d", tempLine);
  tempgraph.selectAll("g.ytaxis").transition(t).call(ytaxis)
  tempgraph.selectAll("g.xtaxis").transition(t).call(xtaxis)
  console.log("temp:", temp);
}
function updateSound(sound) {
  soundData.push({
    "Time": parseTime(moment().format('hh:mm:ss')),
    "Sound": sound
  });
  // redefine axes
  xsound.domain(d3.extent(soundData, function(d){return d.Time}))
  ysound.domain(getSoundRange())

  // Redefine paths
  soundLine = d3.line()
  .x(function(d) {return xsound(d.Time)})
  .y(function(d) {return ysound(d.Sound)});

  var trans_dur = 100;
  var t = d3.transition().duration(trans_dur).ease(d3.easeLinear)
  soundgraph.selectAll("path.soundline").datum(soundData).transition(t).attr("d", soundLine);
  soundgraph.selectAll("g.ysaxis").transition(t).call(ysaxis)
  soundgraph.selectAll("g.xsaxis").transition(t).call(xsaxis)
  console.log("sound:", sound);
}

