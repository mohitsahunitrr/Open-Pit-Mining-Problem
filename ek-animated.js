let animationInterval;
let svg;

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


let count = 30;
const EK = (graph, source, sink, animationInterval, svg) => {
  animationInterval = animationInterval;
  svg = svg;

  let parent = [];

  for (let i = 0; i < graph.length; i++){
    parent.push(-1);
  }


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
    animatePath(path, count, "search",svg);
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
    animatePath(augmentingPath, count, "augment",svg)

    count = count + (path.length - 1);
    // debugger

    resetBFSLinks(path, count,svg);
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


  return {max_flow, solution, count};
}

function animatePath(path, count, type, svg) {
  for (let i = 0; i < path.length - 1; i++){
    setTimeout(function(){
      debugger
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

function resetBFSLinks(path,count,svg){
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

module.exports = EK;
