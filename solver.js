class Solver {
  constructor(stepping, playback, count, matrix, parent, max_flow, svgGraph, mineSvg, mine, currentProfit){
    // debugger
    this.stepping = stepping;
    this.playback = playback;
    this.count = count;
    this.matrix = matrix;
    this.parent = parent;
    this.max_flow = max_flow;
    this.svgGraph = svgGraph;
    this.infCapacity = 1000000;
    this.setup();
    this.animationInterval = 300;
    this.mineSvg = mineSvg;
    this.mine = mine;
    this.reducer = (acc, el) => acc + el;
    this.maxProfit = this.matrix[0].reduce(this.reducer);
    this.solution;
    this.colorMap = {"#8B4513": "rust", "#FFD700": "gold", "#c8c8c8": "silver", "#bdad9c": "stone"};
    this.currentProfit = 0;
  }

  setup(){
    // this.svgGraph.append("rect")
    // .attr("id","step")
    // .attr("x", 10)
    // .attr("y", 10)
    // .attr("width", 50)
    // .attr("height", 50)
    // .attr("fill", "orange")
    //
    // this.svgGraph.append("rect")
    // .attr("id","play")
    // .attr("x", 70)
    // .attr("y", 10)
    // .attr("width", 50)
    // .attr("height", 50)
    // .attr("fill", "green")
    //
    // this.svgGraph.append("rect")
    // .attr("id","pause")
    // .attr("x", 130)
    // .attr("y", 10)
    // .attr("width", 50)
    // .attr("height", 50)
    // .attr("fill", "red")
    //
    // this.svgGraph.append("rect")
    // .attr("id","mine")
    // .attr("x", 190)
    // .attr("y", 10)
    // .attr("width", 50)
    // .attr("height", 50)
    // .attr("fill", "white")

    this.addListeners();
  }

  addListeners(){
    // let playButton = document.getElementById("play");
    // playButton.addEventListener("click", e => {
    //   if (!this.stepping) {
    //     // this.solver.step();
    //     this.step();
    //   }
    //   this.playback = true;
    // })
    //
    // let stepButton = document.getElementById("step");
    // stepButton.addEventListener("click", e => {
    //   this.step();
    // })
    //
    // let pauseButton = document.getElementById("pause");
    // pauseButton.addEventListener("click", e => {
    //   // this.solver.playback = false;
    //   this.playback = false;
    // })
    //
    // let mineButton = document.getElementById("mine");
    // mineButton.addEventListener("click", e => {
    //   // this.solver.playback = false;
    //   this.mineIt();
    // })

    document.getElementById("step-animation").onclick = () => this.step();
    document.getElementById("play-animation").onclick = () => {
      debugger
      if (!this.stepping) {
        // this.solver.step();
        this.step();
      }
      this.playback = true;
    }
    document.getElementById("stop-animation").onclick = () => this.playback = false;
    document.getElementById("mine-animation").onclick = () => this.mineIt();

  }

  mineIt(){
    this.mineSvg.selectAll("rect")
    .transition()
    .duration(1000)
    .style("stroke", "black")
    .attr("fill", d => {
      return `url(#${this.colorMap[d.color]})`
    })

    const solutionBlocks = this.solution.slice(1).reverse();
    let count = 1;


    solutionBlocks.forEach(block => {
      setTimeout(()=>{
        this.mineBlock(block);
      }, this.animationInterval * (count/2))
      count++;
    })
  }

  mineBlock(block){
    this.mineSvg.selectAll("rect")
    .filter(d => {
      debugger
      return this.findIndexFromRowCol(d.row,d.col) === block
    })
    .transition()
    .duration(1000)
    .style("stroke","none")
    .attr("fill","none")

    this.mineSvg.selectAll("text")
    .filter(d => {
      debugger
      return this.findIndexFromRowCol(d.row,d.col) === block
    })
    .transition()
    .duration(1000)
    .style("fill","none")


  }

  BFS(graph, s, t, parent){
    // debugger
    let visited = [];
    for (let i = 0; i < 5; i++){
      visited.push(false);
    }

    let queue = [];

    queue.push(s);
    visited[s] = true;
    //
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

  step(){
    debugger
    this.stepping = true;
    this.count = 0;
    let graph = this.matrix;
    let source = 0;
    let sink = this.findIndexFromRowCol(0,this.mine[0].length-1)+1;
    let parent = this.parent;
    if (this.BFS(graph, source, sink, parent).pathToSink){
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        // debugger
        path_flow = Math.min(path_flow, graph[parent[s]][s]);
        s = parent[s];
        path.unshift(s);
      }
      //
      this.animatePath(path, this.count, "search");
      this.max_flow = this.max_flow + path_flow;
      //
      this.count = this.count + (path.length - 1);

      let t = sink;
      let augmentingPath = [t];
      while (t != source){
        let u = parent[t];
        graph[u][t] =  graph[u][t] - path_flow;
        graph[t][u] = graph[t][u] + path_flow;
        let z = graph[u][t];
        this.animateAugment(u,t,this.count,graph);
        this.count = this.count + 1;
        //
        // updateCapacities(u,t,this.count);
        t = parent[t];
        augmentingPath.push(t)
      }
      // animatePath(augmentingPath, this.count, "augment",graph)

      // this.count = this.count + (path.length - 1);
      //

      this.resetBFSLinks(path, this.count);

      this.count = this.count + 1;
      setTimeout(() => {
        this.stepping = false;
        if (this.playback){
          // debugger
          this.count = this.count + 1;
            this.step()
        }
        // else{
        //   count = 0;
        // }
      }, this.count*this.animationInterval);
    }else{
      let solution = [0];
      let queue = [0]
      let solutionEdges = [];

      //finds solution nodes
      this.matrix[0].forEach((el,i) => {
        if (el > 0){
          solution.push(i);
          queue.push(i);
          solutionEdges.push([0,i]);
        }
      })
      //
      while (queue.length > 0){
        let nextNode = queue.shift();
        this.matrix[nextNode].forEach((el,i) => {
          if (el > 0 && !solution.includes(i)){
            solution.push(i);
            queue.push(i);
            solutionEdges.push([nextNode,i]);
          }
        })
      }this.solution = solution;
      const totalProfit = this.matrix[0].reduce(this.reducer);

      this.mineSvg.selectAll(".profit").transition().duration(1000)
      .attr("transform", d => {
          return `translate(${120}, ${10})`
      })

      this.mineSvg.selectAll(".maxProfit")
      .text(`The most you could have earned is $${totalProfit}k`)

      this.mineSvg.selectAll(".profitSummary")
      .text(`You missed out on $${totalProfit - this.currentProfit}k!`)

      setTimeout(() => {
        debugger
        this.mineSvg.selectAll(".maxProfit").transition().duration(1000)
        .attr("transform", d => {
          return `translate(${120}, ${45})`
        })
      }, 1000)

      setTimeout(() => {
        debugger
        this.mineSvg.selectAll(".profitSummary").transition().duration(1000)
        .attr("transform", d => {
          return `translate(${120}, ${70})`
        })
      }, 2000)


      this.highlightSolution(solution,0,solutionEdges);
      // debugger
    }
    // debugger
  }


  EK(graph, source, sink){

    while (this.BFS(graph, source, sink, parent).pathToSink) {
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        path_flow = Math.min(path_flow, graph[parent[s]][s]);
        s = parent[s];
        path.unshift(s);
      }
      //
      this.animatePath(path, this.count, "search");
      max_flow = max_flow + path_flow;
      //
      this.count = this.count + (path.length - 1);

      let t = sink;
      let augmentingPath = [t];
      while (t != source){
        let u = parent[t];
        graph[u][t] =  graph[u][t] - path_flow;
        graph[t][u] = graph[t][u] + path_flow;
        let z = graph[u][t];
        this.animateAugment(u,t,this.count,graph);
        this.count = this.count + 1;
        //
        // updateCapacities(u,t,count);
        t = parent[t];
        augmentingPath.push(t)
      }
      // animatePath(augmentingPath, count, "augment",graph)

      // count = count + (path.length - 1);
      //

      this.resetBFSLinks(path, this.count);
      this.count = this.count + 1;
    }

    let solution = [0];
    let queue = [0]
    let solutionEdges = [];

    //finds solution nodes
    graph[0].forEach((el,i) => {
      if (el > 0){
        solution.push(i);
        queue.push(i);
        solutionEdges.push([0,i]);
      }
    })
    //
    while (queue.length > 0){
      let nextNode = queue.shift();
      graph[nextNode].forEach((el,i) => {
        if (el > 0 && !solution.includes(i)){
          solution.push(i);
          queue.push(i);
          solutionEdges.push([nextNode,i]);
        }
      })
    }
    this.count = this.count + 1;


    return {max_flow, solution, count:this.count, solutionEdges};
  }

  updateCapacities(source,target,count,graph){
    //
    setTimeout(() => {
      //
      this.svgGraph.selectAll("textPath")
      .filter(function(d){
        //
        return d.source.index === source && d.target.index === target;
      })
      .text((d) => {
        //
        let cap;
        // debugger
        if (d.capacity === this.infCapacity){
          cap = `∞`
        }
        else{
          cap = `${d.capacity}`
        }
        //
        return `${d.capacity - graph[source][target]}:${cap}`
      })
    },this.animationInterval/2);
  }

  pathMatch(tmpArr, solutionArr){
    let result = false;
    solutionArr.forEach(arr => {
      if (tmpArr[0] === arr[0] && tmpArr[1] === arr[1]){
        result = true;
      }
    })
    return result;
  }

  highlightSolution(solution, count, solutionEdges){
    setTimeout(() => {
      this.svgGraph.selectAll("circle")
      // .filter(function(d) {
      //   //
      //   return solution.includes(d.index);
      // })
      .transition()
      .duration(1000)
      .attr("fill", function(d){
        if (solution.includes(d.index)){
          return "white"
        }else{
          return "black"
        }
      })

      this.svgGraph.selectAll("text")
      // .filter(function(d) {
      //   //
      //   return solution.includes(d.index);
      // })
      .transition()
      .duration(1000)
      .style("fill", function(d){
        // return "black"
        if (solution.includes(d.index)){
          return "black"
        }else{
          return "gray"
        }
      });

      this.mineSvg.selectAll("rect")
      .transition()
      .duration(1000)
      // .attr("fill", (d) => {
      //   if (solution.includes(this.findIndexFromRowCol(d.row,d.col))){
      //     return "white"
      //   }else{
      //     return "black"
      //   }
      // })
      .style("stroke", (d) => {
        if (d.border === "red"){
          return "red"
        }else{
          if (solution.includes(this.findIndexFromRowCol(d.row,d.col))){
            return "black"
          }else{
            return "white"
          }
        }
      })
      .attr("fill", d => {
        if (solution.includes(this.findIndexFromRowCol(d.row,d.col))){
          return "white"
        }else{
          return "black"
        }
      })

    },this.animationInterval*count)
  }

  animateAugment(source,target,count,graph){
    // updateCapacities(source,target,count,graph);
    setTimeout(() => {
      this.svgGraph.selectAll(".link")
      .filter((d)=>{

        //
        if (d.source.index === source && d.target.index === target){
          //
          this.updateCapacities(d.source.index, d.target.index,count,graph);
          return true;
        // return d.source.index === path[i+1] && d.target.index === path[i]
        }
      })
      .transition()
      .duration(this.animationInterval)
      .style("stroke", function(){
          return "#039ab5"
      })

      this.mineSvg.selectAll("rect")
      .filter((d)=>{
        if (this.findIndexFromRowCol(d.row,d.col) === target){
          return true;
        // return d.source.index === path[i+1] && d.target.index === path[i]
        }
      })
      .transition()
      .duration(this.animationInterval)
      .attr("fill", function(){
          return "#039ab5"
      })
    }, this.animationInterval*count)
  }

  findIdFromIndex(index){
    const second = index%4;
    const first = (index-second)/4;
    return `rect:${first}-${second}`
  }

  findIndexFromRowCol(row,col){
    let minRow = this.mine[this.mine.length-1].length;
    let height = this.mine.length;
    let offset;
    if (row === this.mine.length - 1){
      offset = 0;
    }else{
      let n = height-2-row;
      offset = (n*(n+1))/2;
    }
    return minRow*(height-1-row) + col + 1 + offset;
  }

  animatePath(path, count, type,graph) {
    for (let i = 0; i < path.length - 1; i++){
      // debugger
      setTimeout(() => {
        this.svgGraph.selectAll(".link")
        .filter(function(d){
          if (type === "search"){
            return d.source.index === path[i] && d.target.index === path[i+1]
          }else{
            debugger
            if (d.source.index === path[i+1] && d.target.index === path[i]){
              //
              this.updateCapacities(d.source.index, d.target.index,count,graph);
              return true;
            }
            // return d.source.index === path[i+1] && d.target.index === path[i]
          }
        })
        .transition()
        .duration(this.animationInterval)
        .style("stroke", function(){
          if (type === "search"){
            return "red"
          }else if (type === "augment"){
            return "#039ab5"
          }
        })
        .style("stroke-width", d => {
          return (d.capacity > 5 ? 4 : 8);
        })

        this.mineSvg.selectAll("rect").filter((d) => {
          if (type === "search"){
            if (this.findIndexFromRowCol(d.row,d.col) === path[i+1]){
              debugger
              return true;
            }
          }else{
            debugger
            if (this.findIndexFromRowCol(d.row,d.col) === path[i]){
              debugger
              return true;
            }
          }
        })
        .transition()
        .duration(this.animationInterval)
        .attr("fill", function(){
          if (type === "search"){
            return "red"
          }else if (type === "augment"){
            return "#039ab5"
          }
        })
      }, this.animationInterval*count)
      count = count + 1
    }
  }

  resetBFSLinks(path,count){
    for (let i = 0; i < path.length - 1; i++){
      setTimeout(() => {
        this.svgGraph.selectAll(".link")
        .filter(function(d){
          //
          return d.source.index === path[i] && d.target.index === path[i+1]
        })
        .transition()
        .duration(this.animationInterval)
        .style("stroke", (d)=>{
          debugger
          if (d.capacity === this.infCapacity){
            return "#444444"
          }else if (d.target.label === "t"){
            if (d.capacity === 3){
              return `url(#rust)`;
            }else{
              return `url(#stone)`;
            }
          }else if ( d.source.label === "s"){
            if (d.capacity === 5){
              return `url(#gold)`;
            }else{
              return `url(#silver)`;
            }
          }
        })
        .style("stroke-width", d => {
          return (d.capacity > 5 ? 4 : 8);
        })

        this.mineSvg.selectAll("rect")
        .filter((d) => {
          debugger
          return this.findIndexFromRowCol(d.row,d.col) === path[i+1]
        })
        .transition()
        .duration(this.animationInterval)
        .attr("fill", (d)=>{
          debugger
          return `url(#${this.colorMap[d.color]})`;
        })
      }, this.animationInterval*count)
    }
  }
}

export default Solver;
