import Solver from "./solver.js";

class Graph {
  constructor(mineSvg){
    this.mineSvg = mineSvg;
    this.matrix = [];
    this.mine;
    this.mineH;
    this.mineW;
    this.infCapacity = 1000000;
    this.svgWidth = 900;
    this.svgHeight = 900;
    this.svgGraph = d3.select("body").append("svg").attr("class","svgGraph").attr("width", this.svgWidth).attr("height", this.svgHeight);
    this.nodes = [];
    this.links = [];
    this.node;
    this.edgepaths;
    this.edgelabels;
    this.link;
    this.nodeLabelList = "abcdefghijklmnopqruvwxyz"
    this.innerNodeCount;
    this.force;
    this.animationInterval = 100;
    this.parent = [];

    this.count = 0;
    this.max_flow = 0;
    this.cont = true;
    this.playback = false;
    this.stepping = false;
    // debugger
    this.solver;// = new Solver();
  }

  clearGraph(){
    d3.select(".svgGraph").selectAll("*").remove();
    this.nodes = [];
    this.links = [];
    this.matrix = [];
  }

  populateMatrix(size){
    for (let row = 0; row < size; row++){
      let newRow = []
      for (let col = 0; col < size; col++){
        newRow.push(0)
      }
      this.matrix.push(newRow);
    }
    for (let i = 0; i < this.matrix.length; i++){
      this.parent.push(-1);
    }

  }

  findBlocksAbove(i,j,mine){
    // debugger
    const result = [];
    if (i === 0) return result;
    if (j > 0) result.push([i-1,j-1]);
    result.push([i-1,j]);
    if (j < mine[0].length - 1) result.push([i-1,j+1]);
    // debugger
    return result;
  }

  findNodeNum(i,j,mine){
    // debugger
    // return 1 + (this.mineH - 1 - i)*this.mineW + j
    return 1 + mine[i][j].idx;
  }

  generateMatrixFromMine(mineObj){
    this.mine = mineObj.mine;
    debugger
    const matrixSize = mineObj.numBlocks + 2;
    this.populateMatrix(matrixSize);
    // this.innerNodeCount = 0;
    let nodeLayers = mineObj.nodeLayers;
    // this.mineH = mine.length;
    // this.mineW = mine[0].length;
    this.mine.forEach((row,i) => {
      let tmpRow = row.slice();
      tmpRow.forEach((el, j) => {
        // debugger
        if (el.profit !== null){
          // this.innerNodeCount++;
          let newPos = this.findNodeNum(i,j,this.mine);
          if (el.profit > 0) this.matrix[0][newPos] = el.profit;
          else if (el.profit < 0) this.matrix[newPos][this.matrix.length - 1] = (-1*el.profit);
          let aboves = this.findBlocksAbove(i,j,this.mine);
          // debugger
          aboves.forEach(pos => {
            el;
            mineObj;
            // debugger
            let intRow = this.findNodeNum(i,j,this.mine);
            let intCol = this.findNodeNum(pos[0],pos[1],this.mine);
            this.matrix[intRow][intCol] = this.infCapacity;
          })
          // debugger
          i;
          // nodeLayers;
          // debugger
          // if (nodeLayers[i][0] === el.idx){
          //   this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: this.svgWidth/10, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          // }else if (nodeLayers[i][1] === el.idx){
          //   this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: 9*this.svgWidth/10, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          // }else{
          //   this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit});
          // }
        }
      })
    })
    // this.nodes.unshift({label: "s", index: 0, profit: null, fixed: true, x: this.svgWidth/2, y: this.svgHeight-50});
    // this.nodes.push({label: "t", index: matrixSize-1, profit: null, fixed: true, x: this.svgWidth/2, y: 50});
    // debugger
    this.populateNodes(mineObj);
  }

  populateNodes(mineObj){
    const matrixSize = mineObj.numBlocks + 2;
    this.innerNodeCount = matrixSize-1;
    let nodeLayers = mineObj.nodeLayers;
    this.mine.forEach((row,i) => {
      let tmpRow = row.slice();
      tmpRow.reverse().forEach((el,j) => {
        if (el.profit !== null){
          this.innerNodeCount--;
          // if (nodeLayers[i][0] === el.idx){
          //   this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: this.svgWidth/10, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          // }else if (nodeLayers[i][1] === el.idx){
          //   this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: 9*this.svgWidth/10, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          // }else{
          //   this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: this.svgWidth - (j*this.svgWidth/3) + ((1.5-j)*(1 - Math.abs(i - 1)))*100, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1) + 50*(i-1))});
          // }
          if (nodeLayers[i][0] === el.idx){
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: this.svgWidth/10, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          }else if (nodeLayers[i][1] === el.idx){
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: 9*this.svgWidth/10, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          }else{
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit});
          }
        }
      })
    })
    this.nodes.unshift({label: "s", index: 0, profit: null, fixed: true, x: this.svgWidth/2, y: this.svgHeight-50});
    this.nodes.push({label: "t", index: matrixSize-1, profit: null, fixed: true, x: this.svgWidth/2, y: 50});
    debugger;
  }

  populateLinks(){
    let linkId = 0;
    // debugger
    this.matrix.forEach((row,i) => {
      row.forEach((el,j) => {
        if (el > 0){
          // debugger
          this.links.push({source: i, target: j, res: 0, capacity: el, id: linkId});
          linkId = linkId + 1;
        }
      })
    })
    debugger
  }

  // addListeners(){
  //   let playButton = document.getElementById("play");
  //   playButton.addEventListener("click", e => {
  //     if (!this.stepping) {
  //       // this.solver.step();
  //       this.step();
  //     }
  //     this.playback = true;
  //   })
  //
  //   let stepButton = document.getElementById("step");
  //   stepButton.addEventListener("click", e => {
  //     this.solver.step();
  //     this.step();
  //   })
  //
  //   let pauseButton = document.getElementById("pause");
  //   pauseButton.addEventListener("click", e => {
  //     // this.solver.playback = false;
  //     this.playback = false;
  //   })
  // }

  renderGraph(){
    // this.svgGraph = d3.select('body').append('svg')
    // .attr('width', this.svgWidth)
    // .attr('height', this.svgHeight);

    //
    //apply force conditions

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


    this.force = d3.layout.force()
    .size([this.svgWidth, this.svgHeight])
    .nodes(d3.values(this.nodes))
    .links(this.links)
    .on("tick", () => {
      // debugger
      this.node.attr('cx', function(d) {
        // debugger
        return d.x;
      })
      .attr('cy', function(d) { return d.y; })
      .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });

      // debugger
      this.link.attr('x1', function(d) {
        // debugger
        return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });


      this.edgepaths.attr('d', function(d) {
        let path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
        return path
      });

      this.edgelabels.attr("transform", function(d,i){
        if (d.target.x < d.source.x){
          let bbox = this.getBBox();
          let rx = bbox.x + bbox.width/2;
          let ry = bbox.y + bbox.height/2;
          return `rotate(180 ${rx} ${ry})`;
        }
        else{
          return "rotate(0)";
        }
      })
    })
    // .linkDistance(100)
    .gravity(0.01)
    .charge(-1500)
    // .linkDistance(100)
    .linkStrength(0.1)
    .start();

    //create links
    const infCapacity = this.infCapacity;
    this.link = this.svgGraph.append("g").selectAll('.link')
    .data(this.links)
    .enter().append('line')
    .attr("class", "link")
    .attr('id', function(d) {
      return `link_${d.id}`})
      .style("stroke", function(d){
        if (d.capacity === infCapacity){
          return "#444"
        }else if (d.target.label === "t"){
          return "#8B4513"
        }else if ( d.source.label === "s"){
          return "#FFD700"
        }
      })
      .attr("marker-end","url(#arrowhead)")
      .style("stroke-width", "4")

      //create nodes
      this.node = this.svgGraph.selectAll(".node")
      .data(this.nodes)
      .enter().append("g")
      .attr('class', 'node')
      // .attr("transform",transform);
      .call(this.force.drag);

      //add circle to visualize nodes
      this.node.append("circle")
      .attr('r', 12)
      .attr("fill", function(d) {
        // debugger
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
      this.node.append("text")
      .attr("class","nodeLabel")
      .attr("dx", "-.2em")
      .attr("dy", ".35em")
      .style("fill", "white")
      .text(function(d) {return d.label})

      this.edgepaths = this.svgGraph.selectAll(".edgepath")
      .data(this.links)
      .enter()
      .append('path')
      .attr({'d': function(d) {
        //
        return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
        'class':'edgepath',
        'fill-opacity':0,
        'stroke-opacity':0,
        'fill':'blue',
        'stroke':'red',
        'id':function(d,i) {return `edgepath:${d.source.index}-${d.target.index}`}})
        .style("pointer-events", "none");
        //
        this.edgelabels = this.svgGraph.selectAll(".edgelabel")
        .data(this.links)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr({'class':'edgelabel',
        'id':function(d,i){return 'edgelabel'+i},
        'dx':80,
        'dy':-5,
        'font-size':20,
        'fill':'#aaa'});
        //
        //
        this.edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {
          //
          return `#edgepath:${d.source.index}-${d.target.index}`})
          // return '#edgepath'+i})
          .style("pointer-events", "none")
          .text(function(d){
            // `${d.capacity}`
            let cap;
            if (d.capacity === infCapacity){
              cap = `∞`
            }
            else{
              cap = `${d.capacity}`
            }
            return `${d.res}:${cap}`});


            this.svgGraph.append('defs').append('marker')
                .attr({'id':'arrowhead',
                       'viewBox':'-0 -5 10 10',
                       'refX':25,
                       'refY':0,
                       //'markerUnits':'strokeWidth',
                       'orient':'auto',
                       'markerWidth':4,
                       'markerHeight':4,
                       'xoverflow':'visible'})
                .append('svg:path')
                    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                    .attr('fill', '#ccc')

    // debugger
    // this.svgGraph.append("circle").attr("cx",100).attr("cy",100).attr("r",20).attr("fill","white");
    // debugger
     // debugger

    // this.link = this.svgGraph.append("g").selectAll('.link')
    //     .data(this.links)
    //     .enter().append('line')
    //     .attr("class", "link")
    //     .attr('id', function(d) {
    //       return `link_${d.id}`})
    //     .style("stroke", function(d){
    //       if (d.capacity === this.infCapacity){
    //         return "#000"
    //       }else if (d.target.label === "t"){
    //         return "#632f12"
    //       }else if ( d.source.label === "s"){
    //         return "#fff"
    //       }
    //     })
    //     // .attr("marker-end","url(#arrowhead)")
    //     .style("stroke-width", "4")
    //
    //     // const this = this;
    //     this.force = d3.layout.force()
    //     .size(function(){[this.svgWidth, this.svgHeight]})
    //     .nodes(d3.values(this.nodes))
    //     .links(this.links)
    //     .on("tick", () => {
    //       debugger
    //         this.node.attr('cx', function(d) {
    //           debugger
    //             return d.x;
    //           })
    //           .attr('cy', function(d) { return d.y; })
    //           .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });
    //
    //         this.link.attr('x1', function(d) { return d.source.x; })
    //             .attr('y1', function(d) { return d.source.y; })
    //             .attr('x2', function(d) { return d.target.x; })
    //             .attr('y2', function(d) { return d.target.y; });
    //
    //
    //         this.edgepaths.attr('d', function(d) {
    //           let path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
    //           return path
    //         });
    //
    //         this.edgelabels.attr("transform", function(d,i){
    //           if (d.target.x < d.source.x){
    //             bbox = this.getBBox();
    //             rx = bbox.x + bbox.width/2;
    //             ry = bbox.y + bbox.height/2;
    //             return `rotate(180 ${rx} ${ry})`;
    //           }
    //           else{
    //             return "rotate(0)";
    //           }
    //         })
    //     })
    //     // .linkDistance(100)
    //     .gravity(0.1)
    //     .charge(-1200)
    //     .linkDistance(120)
    //     .linkStrength(0.1)
    //     .start();
    //   this.node = this.svgGraph.selectAll(".node")
    //   .data(this.nodes)
    //   .enter().append("g")
    //   .attr('class', 'node')
    //   // .attr("transform",transform);
    //   .call(this.force.drag);
    //   // debugger
    //
    //   this.node.append("circle")
    //   .attr('r', 12)
    //   .attr("fill", function(d) {
    //     if (d.label === "s"){
    //       return "#ce9308"
    //     }else if (d.label === "t"){
    //       return "#969696"
    //     }else if (d.profit !== null && d.profit > 0){
    //       return "#31703d"
    //     }else if (d.profit !== null && d.profit <= 0){
    //       return "#961919"
    //     }
    //   })
    //   .style("stroke", "#fff")
    //   .style("stroke-weight", "3")
    //
    //   this.node.append("text")
    //   .attr("class","nodeLabel")
    //   .attr("dx", "-.2em")
    //   .attr("dy", ".35em")
    //   .style("fill", "white")
    //   .text(function(d) {return d.label})
    //
    //   this.edgepaths = this.svgGraph.selectAll(".edgepath")
    //       .data(this.links)
    //       .enter()
    //       .append('path')
    //       .attr({'d': function(d) {
    //         // debugger
    //         return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
    //              'class':'edgepath',
    //              'fill-opacity':0,
    //              'stroke-opacity':0,
    //              'fill':'blue',
    //              'stroke':'red',
    //              'id':function(d,i) {return `edgepath:${d.source.index}-${d.target.index}`}})
    //       .style("pointer-events", "none");
    //   //
    //       this.edgelabels = this.svgGraph.selectAll(".edgelabel")
    //           .data(this.links)
    //           .enter()
    //           .append('text')
    //           .style("pointer-events", "none")
    //           .attr({'class':'edgelabel',
    //                  'id':function(d,i){return 'edgelabel'+i},
    //                  'dx':80,
    //                  'dy':-5,
    //                  'font-size':20,
    //                  'fill':'#aaa'});
    //   //
    //   //
    //        this.edgelabels.append('textPath')
    //            .attr('xlink:href',function(d,i) {
    //              // debugger
    //               return `#edgepath:${d.source.index}-${d.target.index}`})
    //              // return '#edgepath'+i})
    //            .style("pointer-events", "none")
    //            .text(function(d){
    //              // debugger`${d.capacity}`
    //              let cap;
    //              if (d.capacity === this.infCapacity){
    //                cap = `∞`
    //              }
    //              else{
    //                cap = `${d.capacity}`
    //              }
    //              return `${d.res}:${cap}`});
    //

    debugger
    this.solver = new Solver(this.stepping, this.playback, this.count, this.matrix, this.parent, this.max_flow, this.svgGraph, this.mineSvg);
  }


  BFS(graph, s, t, parent){
    debugger
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
    this.stepping = true;
    this.count = 0;
    let graph = this.matrix;
    let source = 0;
    let sink = 13;
    let parent = this.parent;
    if (this.BFS(graph, source, sink, parent).pathToSink){
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        debugger
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
          debugger
          this.count = this.count + 1;
            this.step()
        }
        // else{
        //   count = 0;
        // }
      }, this.count*this.animationInterval);
    }
    debugger
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
        debugger
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
    setTimeout(function(){
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

      // this.svgGraph.selectAll(".link").filter(function(d) {
      //   let tmp = [d.source.index,d.target.index];
      //   //
      //   pathMatch(tmp,solutionEdges)
      //   return pathMatch(tmp,solutionEdges);
      // })
      // .transition()
      // .duration(1000)
      // .style("stroke", "red")
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
    }, this.animationInterval*count)
  }

  findBlockNum(id){
    const nums = id.split(":");
    const parsedNums = nums.split("-");
    const first = parsedNums[0];
    const second = parsedNums[1];
    return 12 - (first*4) - second;
  }

  animatePath(path, count, type,graph) {
    debugger
    for (let i = 0; i < path.length - 1; i++){
      debugger
      setTimeout(() => {
        this.svgGraph.selectAll(".link")
        .filter(function(d){
          if (type === "search"){
            return d.source.index === path[i] && d.target.index === path[i+1]
          }else{
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
        // this.svgGraph.selectAll(".link")
        // .filter(function(d){
        //   if (type === "search"){
        //     return d.source.index === path[i] && d.target.index === path[i+1]
        //   }else{
        //     if (d.source.index === path[i+1] && d.target.index === path[i]){
        //       //
        //       this.updateCapacities(d.source.index, d.target.index,count,graph);
        //       return true;
        //     }
        //     // return d.source.index === path[i+1] && d.target.index === path[i]
        //   }
        // })
        // .transition()
        // .duration(this.animationInterval)
        // .style("stroke", function(){
        //   if (type === "search"){
        //     return "red"
        //   }else if (type === "augment"){
        //     return "#039ab5"
        //   }
        // })
      }, this.animationInterval*count)
      count = count + 1
      //
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
          if (d.capacity === this.infCapacity){
            return "#444444"
          }else if (d.target.label === "t"){
            return "#8b4516"
          }else if ( d.source.label === "s"){
            return "#ffd724"
          }
        })
      }, this.animationInterval*count)
    }
  }



}

export default Graph;
