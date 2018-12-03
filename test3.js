// const EK = require("./ek-animated.js");


const draw3 = function(){
  let width = 900,
      height = 900;

  animationInterval = 100;

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
    {label: "a", index: 1, profit: matrix[0][1], row: 1, fixed: true, x: width/2-150, y: height - 325},
    {label: "b", index: 2, profit: matrix[0][2], row: 1},
    {label: "c", index: 3, profit: matrix[0][3], row: 1, fixed: true, x: width/2+150, y: height - 325},
    {label: "d", index: 4, profit: matrix[4][9]*-1, row: 0, fixed: true, x: width/2 - 200, y: 325},
    {label: "e", index: 5, profit: matrix[5][9]*-1, row: 0},
    {label: "f", index: 6, profit: matrix[6][9]*-1, row: 0},
    {label: "g", index: 7, profit: matrix[7][9]*-1, row: 0},
    {label: "h", index: 8, profit: matrix[8][9]*-1, row: 0, fixed: true, x: width/2 + 200, y: 325},
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

  let linkIdIdx = 0;
  //creates links with finite capacities
  const setFiniteLinks = () => {
    nodes.forEach((node,i) => {
      // debugger
      if (node.label !== "s" && node.label !== "t"){
        if (node.profit > 0){
          links.push({source: 0, target: i, res: 0, capacity: node.profit})
        }else{
          links.push({source: i, target: (nodes.length-1), capacity: (-1 * node.profit), res: 0, id: linkIdIdx})
        }
      }
      linkIdIdx = linkIdIdx + 1;
    })
  }
  //creates links with infinite capacities
  const setInfiniteLinks = () => {
    restrictions.forEach(restriction => {
      links.push({source: restriction.source, target: restriction.target, res: 0, capacity: infCapacity, id: linkIdIdx})
      linkIdIdx = linkIdIdx + 1;
    })
  }
  simulateInfCapacity();
  setInfiniteLinks();
  setFiniteLinks();
  // debugger

  //create object for manipulation
  let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);


  // debugger
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

      // link.append("linkLabel")
      //   .append("text")
      //   .attr("class","linkLabel")
      //   .attr("x","50")
      //   .attr("y","-20")
      //   .attr("text-anchor","start")
      //   .style("fill","#000")
      //   .attr("xlink:href",function(d,i){
      //     debugger
      //     return `#linkId_${i}`;})
      //   .text(function(d) {
      //     return d.id;
      //   })

  //create links
  let link = svg.append("g").selectAll('.link')
      .data(force.links())
      .enter().append('line')
      .attr("class", "link")
      .attr('id', function(d) {
        return `link_${d.id}`})
      .style("stroke", function(d){
        if (d.capacity === infCapacity){
          return "#000"
        }else if (d.target.label === "t"){
          return "#632f12"
        }else if ( d.source.label === "s"){
          return "#fff"
        }
      })
      // .attr("marker-end","url(#arrowhead)")
      .style("stroke-width", "4")

      //create nodes
      let node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr('class', 'node')
      // .attr("transform",transform);
      .call(force.drag);

      //add circle to visualize nodes
      node.append("circle")
      .attr('r', 12)
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

  let edgepaths = svg.selectAll(".edgepath")
      .data(links)
      .enter()
      .append('path')
      .attr({'d': function(d) {
        // debugger
        return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
             'class':'edgepath',
             'fill-opacity':0,
             'stroke-opacity':0,
             'fill':'blue',
             'stroke':'red',
             'id':function(d,i) {return 'edgepath'+i}})
      .style("pointer-events", "none");

      var edgelabels = svg.selectAll(".edgelabel")
          .data(links)
          .enter()
          .append('text')
          .style("pointer-events", "none")
          .attr({'class':'edgelabel',
                 'id':function(d,i){return 'edgelabel'+i},
                 'dx':80,
                 'dy':-5,
                 'font-size':20,
                 'fill':'#aaa'});


       edgelabels.append('textPath')
           .attr('xlink:href',function(d,i) {return '#edgepath'+i})
           .style("pointer-events", "none")
           .text(function(d){
             // debugger
             return `${d.res}:${d.capacity}`});
    //
    // let link = svg.selectAll(".link")
    //   .data(force.links())
    //   .enter().append("g")
    //   .attr("class","link")
    //
    //
    // link.append("line")
    // .attr('id', function(d) {
    //   return `link_${d.id}`})
    // .style("stroke", function(d){
    //   if (d.capacity === infCapacity){
    //     return "#000"
    //   }else if (d.target.label === "t"){
    //     return "#632f12"
    //   }else if ( d.source.label === "s"){
    //     return "#fff"
    //   }
    // })
    // .style("stroke-width", "5");

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


      edgepaths.attr('d', function(d) {
        let path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
        return path
      });

      // edgelabels.attr('transform',function(d,i){
      //     if (d.target.x<d.source.x){
      //         bbox = this.getBBox();
      //         rx = bbox.x+bbox.width/2;
      //         ry = bbox.y+bbox.height/2;
      //         return 'rotate(180 '+rx+' '+ry+')';
      //         }
      //     else {
      //         return 'rotate(0)';
      //         }
      // });

      edgelabels.attr("transform", function(d,i){
        if (d.target.x < d.source.x){
          bbox = this.getBBox();
          rx = bbox.x + bbox.width/2;
          ry = bbox.y + bbox.height/2;
          return `rotate(180 ${rx} ${ry})`;
        }
        else{
          return "rotate(0)";
        }
      })
  }

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

  let count = 30;
  const EK = (graph, source, sink) => {


    let max_flow = 0;
    // debugger
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

    //finds solution nodes
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
    count = count + 1;


    return {max_flow, solution};
  }


  // setTimeout(function(){
    // svg.selectAll(".node").filter(function(d){
    //   debugger
    //   return;
    // })
  //   , 1000);
  // })

  // let result = EK(matrix,0,9);
  // highlightSolution(result.solution, count);
  // debugger


  function highlightSolution(solution, count){
    setTimeout(function(){
      svg.selectAll("circle").filter(function(d) {
        // debugger
        return solution.includes(d.index);
      })
      .transition()
      .duration(1000)
      .attr("fill", "white")

      svg.selectAll("text").filter(function(d) {
        // debugger
        return solution.includes(d.index);
      })
      .transition()
      .duration(1000)
      .style("fill", "black")
    },animationInterval*count)
  }

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
