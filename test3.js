const draw3 = function(){
  let width = 900,
      height = 900;

  let nodes = [
    {label: "s", profit: null, row: null, fixed: true, x: width/2, y: height-100},
    {label: "1", profit:4, row: 1, fixed: true, x: width/2-150, y: height - 325},
    {label: "2", profit: 4, row: 1},
    {label: "3", profit: 4, row: 1, fixed: true, x: width/2+150, y: height - 325},
    {label: "4", profit: -1, row: 0, fixed: true, x: width/2 - 200, y: 325},
    {label: "5", profit: -1, row: 0},
    {label: "6", profit: -1, row: 0},
    {label: "7", profit: -1, row: 0},
    {label: "8", profit: -1, row: 0, fixed: true, x: width/2 + 200, y: 325},
    {label: "t", profit: null, row: null, fixed: true, x: width/2, y: 100}
  ]

  let links = [
  ]

  //defines the u -> v edges, i.e. must complete project v before starting project u
  let restrictions = [
    {source: 1, target: 4},
    {source: 1, target: 5},
    {source: 1, target: 6},
    {source: 2, target: 5},
    {source: 2, target: 6},
    {source: 2, target: 7},
    {source: 3, target: 6},
    {source: 3, target: 7},
    {source: 3, target: 8},
  ]

  //effectively the sum of all other capacities + 1 (commonly C + 1)
  infCapacity = 0;

  //computes C + 1
  const simulateInfCapacity = () => {
    nodes.forEach(node => {
      if (node.profit !== null){
        if (node.profit > 0){
          infCapacity = infCapacity + node.profit
        }else{
          infCapacity = infCapacity - node.profit
        }
      }
    })
    infCapacity = infCapacity + 1;
  }

  //creates links with finite capacities
  const setFiniteLinks = () => {
    nodes.forEach((node,i) => {
      // debugger
      if (node.label !== "s" && node.label !== "t"){
        if (node.profit > 0){
          links.push({source: 0, target: i, capacity: node.profit})
        }else{
          links.push({source: i, target: (nodes.length-1), capacity: (-1 * node.profit), res: 0})
        }
      }
    })
  }
  //creates links with infinite capacities
  const setInfiniteLinks = () => {
    restrictions.forEach(restriction => {
      links.push({source: restriction.source, target: restriction.target, capacity: infCapacity})
    })
  }

  simulateInfCapacity();
  setInfiniteLinks();
  setFiniteLinks();

  //create object for manipulation
  let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);

  //apply force conditions
  let force = d3.layout.force()
      .size([width, height])
      .nodes(d3.values(nodes))
      .links(links)
      .on("tick", tick)
      // .linkDistance(100)
      .gravity(0.1)
      .charge(-1200)
      .linkDistance(120)
      .linkStrength(0.1)
      .start();

  //create links
  let link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .style("stroke", function(d){
        if (d.capacity === infCapacity){
          return "#000"
        }else if (d.target.label === "t"){
          return "#632f12"
        }else if ( d.source.label === "s"){
          return "#fff"
        }
      })
      .style("stroke-width", "5");

  //create nodes
  let node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr('class', 'node')
      // .attr("transform",transform);
      .call(force.drag);

  //add circle to visualize nodes
  node.append("circle")
    .attr('r', 10)
    .attr("fill", function(d) {
      if (d.label === "s"){
        return "#ce9308"
      }else if (d.label === "t"){
        return "#969696"
      }else if (d.profit !== null && d.profit > 0){
        return "#31703d"
      }else if (d.profit !== null && d.profit <= 0){
         return "#961919"
      }
    })
    .style("stroke", "#fff")
    .style("stroke-weight", "3")

  //add node labels
  node.append("text")
  .attr("dx", "-.2em")
  .attr("dy", ".35em")
  .style("fill", "white")
  .text(function(d) {return d.label})

  link.append("linkText")
  .attr("dx", "-.2em")
  .attr("dy", ".35em")
  .text(function(d) {return d.capacity})

  svg.selectAll("circle").filter(function(d) {
    // debugger
    return;
  })
  .attr("fill", "white")
  // .select("text").text("X")

  function tick(e) {
      node.attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) { return d.y; })
        .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });

      link.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });
  }


  // setTimeout(function(){
  //   svg.selectAll("text")
  //   .filter(function(d){
  //     return d.label === "s"
  //   })
  //   .text("5");

  setTimeout(function(){
    svg.selectAll(".link")
    .filter(function(d){
      debugger
      return d.target.label === "1"
    })
    .transition()
    .duration(1000)
    .style("stroke", "red")
  }, 1000);

  setTimeout(function(){
    svg.selectAll(".link")
    .filter(function(d){
      debugger
      return d.source.label === "1" && d.target.label==="4"
    })
    .transition()
    .duration(1000)
    .style("stroke", "red")
  }, 2000);

  setTimeout(function(){
    svg.selectAll(".link")
    .filter(function(d){
      debugger
      return d.source.label === "4" && d.target.label==="t"
    })
    .transition()
    .duration(1000)
    .style("stroke", "red")
  }, 3000);


  // debugger
  // function update(node){
  //
  // }

}


module.exports = draw3;
