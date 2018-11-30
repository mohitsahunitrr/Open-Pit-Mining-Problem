// const matrix = [
//   [0,20,10,0],
//   [0,0,30,10],
//   [0,0,0,20],
//   [0,0,0,0]
// ]

// const matrix = [
//   [0,0,5,3,0],
//   [0,0,0,0,7],
//   [0,2,0,0,2],
//   [0,5,0,0,0],
//   [0,0,0,0,0]
// ]

// const matrix = [
//   [0,8,8,0],
//   [0,0,0,8],
//   [0,1,0,8],
//   [0,0,0,0]
// ]
//
// const matrix = [
//   [0,100,0,100,100,100,50,50,50,50,0],
//   [0,0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0,50],
//   [0,0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0,0],
//   [0,600,600,600,0,0,0,0,0,0,0],
//   [0,600,600,600,0,0,0,0,0,0,0],
//   [0,600,600,600,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,600,600,600,0,0],
//   [0,0,0,0,0,0,0,0,0,0,0]
// ]

// const matrix = [
//   [0,2,0,0,2,0,0],
//   [0,0,10,0,0,0,0],
//   [0,0,0,10,0,0,1],
//   [0,0,0,0,10,0,2],
//   [0,0,0,0,0,10,0],
//   [0,0,0,0,0,0,1],
//   [0,0,0,0,0,0,0]
// ]

// const matrix = [
//   [0,0,0,0,0,200,200,0],
//   [0,0,0,0,0,0,0,50],
//   [0,0,0,0,0,0,0,50],
//   [0,0,0,0,0,0,0,50],
//   [0,0,0,0,0,0,0,50],
//   [0,5000,5000,5000,5000,0,0,0],
//   [0,5000,5000,5000,5000,0,0,0],
//   [0,0,0,0,0,0,0,0],
// ]

// const matrix = [
//   [0,4,4,0,0,0,0,0],
//   [0,0,0,99,99,99,0,0],
//   [0,0,0,0,99,99,99,0],
//   [0,0,0,0,0,0,0,1],
//   [0,0,0,0,0,0,0,1],
//   [0,0,0,0,0,0,0,1],
//   [0,0,0,0,0,0,0,1],
//   [0,0,0,0,0,0,0,0],
// ]

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


const EK = (graph, source, sink) => {

  let parent = [-1,-1,-1,-1];

  let max_flow = 0;
  debugger
  while (BFS(graph, source, sink, parent).pathToSink) {
    let path_flow = 91;
    let s = sink;
    while (s != source){
      path_flow = Math.min(path_flow, graph[parent[s]][s]);
      s = parent[s];
    }

    max_flow = max_flow + path_flow;

    let t = sink;

    while (t != source){
      let u = parent[t];
      graph[u][t] =  graph[u][t] - path_flow;
      graph[t][u] = graph[t][u] + path_flow;
      t = parent[t];
    }
  }

  let solution = [];
  graph.forEach((arr,i) => {
    if (arr[0] > 0){
        solution.push(i)
    }
})
  return {max_flow, solution};
}
