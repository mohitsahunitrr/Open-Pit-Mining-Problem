const draw3 = function(){
  let width = 900,
      height = 900;

  let animationInterval = 100;

  let matrix = [
    [0,4,1,1,0,0,0,0,0,0],
    [0,0,0,0,25,25,25,0,0,0],
    [0,0,0,0,0,25,25,25,0,0],
    [0,0,0,0,0,0,25,25,25,0],
    [0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0]
  ]

  let nodes = [
    {label: "s", index: 0, profit: null, row: null, fixed: true, x: width/2, y: height-100},
    {label: "1", index: 1, profit: matrix[0][1], row: 1, fixed: true, x: width/2-150, y: height - 325},
    {label: "2", index: 2, profit: matrix[0][2], row: 1},
    {label: "3", index: 3, profit: matrix[0][3], row: 1, fixed: true, x: width/2+150, y: height - 325},
    {label: "4", index: 4, profit: matrix[4][9]*-1, row: 0, fixed: true, x: width/2 - 200, y: 325},
    {label: "5", index: 5, profit: matrix[5][9]*-1, row: 0},
    {label: "6", index: 6, profit: matrix[6][9]*-1, row: 0},
    {label: "7", index: 7, profit: matrix[7][9]*-1, row: 0},
    {label: "8", index: 8, profit: matrix[8][9]*-1, row: 0, fixed: true, x: width/2 + 200, y: 325},
    {label: "t", index: 9, profit: null, row: null, fixed: true, x: width/2, y: 100}
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

  // setTimeout(function(){
  //   svg.selectAll(".link")
  //   .filter(function(d){
  //     debugger
  //     return d.target.label === "1"
  //   })
  //   .transition()
  //   .duration(animationInterval)
  //   .style("stroke", "red")
  // }, animationInterval);
  //
  // setTimeout(function(){
  //   svg.selectAll(".link")
  //   .filter(function(d){
  //     debugger
  //     return d.source.label === "1" && d.target.label==="4"
  //   })
  //   .transition()
  //   .duration(animationInterval)
  //   .style("stroke", "red")
  // }, 2000);
  //
  // setTimeout(function(){
  //   svg.selectAll(".link")
  //   .filter(function(d){
  //     debugger
  //     return d.source.label === "4" && d.target.label==="t"
  //   })
  //   .transition()
  //   .duration(animationInterval)
  //   .style("stroke", "red")
  // }, 3000);













  const BFS = (graph, s, t, parent) => {
    let visited = [];
    for (let i = 0; i < 5; i++){
      visited.push(false);
    }

    let queue = [];

    queue.push(s);
    visited[s] = true;
    // debugger
    while (queue.length > 0) {
      let currentVtx = queue.shift();

      graph[currentVtx].forEach((val, i) => {
        if (!visited[i] && val > 0){
          queue.push(i);
          visited[i] = true;
          parent[i] = currentVtx;
        }
      })
    }
    return {pathToSink: visited[t], parent}
  }

  let parent = [];

  for (let i = 0; i < matrix.length; i++){
    parent.push(-1);
  }

  const EK = (graph, source, sink) => {


    let max_flow = 0;
    // debugger
    let count = 1;
    while (BFS(graph, source, sink, parent).pathToSink) {
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        path_flow = Math.min(path_flow, graph[parent[s]][s]);
        s = parent[s];
        path.unshift(s);
      }
      // debugger
      animatePath(path, count, "search");
      max_flow = max_flow + path_flow;
      // debugger
      count = count + (path.length - 1);

      let t = sink;
      let augmentingPath = [t];
      while (t != source){
        let u = parent[t];
        graph[u][t] =  graph[u][t] - path_flow;
        graph[t][u] = graph[t][u] + path_flow;
        t = parent[t];
        augmentingPath.push(t)
      }
      animatePath(augmentingPath, count, "augment")

      count = count + (path.length - 1);
      // debugger

      resetBFSLinks(path, count);
      count = count + 1;
    }

    let solution = [];
    let queue = []
    graph[0].forEach((el,i) => {
      if (el > 0){
        solution.push(i);
        queue.push(i);
      }
    })
    while (queue.length > 0){
      let nextNode = queue.shift();
      graph[nextNode].forEach((el,i) => {
        if (el > 0 && !solution.includes(i)){
          solution.push(i);
          queue.push(i);
        }
      })
    }
    return {max_flow, solution};
  }


  let result = EK(matrix,0,9);
  debugger
debugger
  function animatePath(path, count, type) {
    for (let i = 0; i < path.length - 1; i++){
      setTimeout(function(){
        svg.selectAll(".link")
        .filter(function(d){
          if (type === "search"){
            return d.source.index === path[i] && d.target.index === path[i+1]
          }else{
            return d.source.index === path[i+1] && d.target.index === path[i]
          }
        })
        .transition()
        .duration(animationInterval)
        .style("stroke", function(){
          if (type === "search"){
            return "red"
          }else if (type === "augment"){
            return "#039ab5"
          }
        })
      }, animationInterval*count)
      count = count + 1
      // debugger
    }

  }

  function resetBFSLinks(path,count){
    for (let i = 0; i < path.length - 1; i++){
      setTimeout(function(){
        svg.selectAll(".link")
        .filter(function(d){
          // debugger
          return d.source.index === path[i] && d.target.index === path[i+1]
        })
        .transition()
        .duration(animationInterval)
        .style("stroke", function(d){
          if (d.capacity === infCapacity){
            return "#000"
          }else if (d.target.label === "t"){
            return "#632f12"
          }else if ( d.source.label === "s"){
            return "#fff"
          }
        })
      }, animationInterval*count)
    }
  }

}


module.exports = draw3;
