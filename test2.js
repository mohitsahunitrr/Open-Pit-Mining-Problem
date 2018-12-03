const draw2 = function() {
  var vis = d3.select("body")
              .append("svg")
  .attr("width", 200).attr("height", 200);

  var nodes = [
      {id: 1, x: 10, y: 50},
      {id: 2, x: 70, y: 10},
      {id: 3, x: 140, y: 50}
    ]

  var links = [
      {source: nodes[0], target: nodes[1]}
    ]

  vis.selectAll("circle")
   .data(nodes)
   .enter()
   .append("svg:circle")
   // .filter(function(d) { return d.id === 1})
   .attr("cx", function(d) {
     // debugger
     return d.x;
   })
   .attr("cy", function(d) { return d.y; })
   .attr("r", "10px")
   .attr("fill", "black");

  vis.selectAll(".line")
     .data(links)
     .enter()
     .append("line")
      .attr("x1", 40)
      .attr("y1", 50)
      .attr("x2", 450)
      .attr("y2", 150)
      .style("stroke", "rgb(6,120,155)");

  vis.selectAll("circle")
  .filter(function(d) {
     // debugger
     return d.id === 1
   })
   .transition()
   .duration(1000)
   .attr("fill", "red");

   vis.selectAll("line").transition().duration(1000).style("stroke", "red");
}

module.exports = draw2;
