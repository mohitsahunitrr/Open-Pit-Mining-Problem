/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./miner.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./graph.js":
/*!******************!*\
  !*** ./graph.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _solver_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./solver.js */ "./solver.js");


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
    this.solver = new _solver_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.stepping, this.playback, this.count, this.matrix, this.parent, this.max_flow, this.svgGraph, this.mineSvg);
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

/* harmony default export */ __webpack_exports__["default"] = (Graph);


/***/ }),

/***/ "./graph2.js":
/*!*******************!*\
  !*** ./graph2.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Graph {
  constructor(){
    this.matrix = [
        [0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,25,25,25,0,0,0],
        [0,0,0,0,0,25,25,25,0,0],
        [0,0,0,0,0,0,25,25,25,0],
        [0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0]
      ];
    this.mine;
    this.mineH;
    this.mineW;
    this.infCapacity = 1000000;
    this.svgWidth = 700;
    this.svgHeight = 900;
    this.svgGraph = d3.select("body").append("svg").attr("width", this.svgWidth).attr("height", this.svgHeight);

    this.nodes = [  {label: "s", index: 0, profit: null, row: null, fixed: true, x: this.svgWidth/2, y: this.svgHeight-100},
      {label: "a", index: 1, profit: this.matrix[0][1], row: 1, fixed: true, x: this.svgWidth/2-150, y: this.svgHeight - 325},
      {label: "b", index: 2, profit: this.matrix[0][2], row: 1},
      {label: "c", index: 3, profit: this.matrix[0][3], row: 1, fixed: true, x: this.svgWidth/2+150, y: this.svgHeight - 325},
      {label: "d", index: 4, profit: this.matrix[4][9]*-1, row: 0, fixed: true, x: this.svgWidth/2 - 200, y: 325},
      {label: "e", index: 5, profit: this.matrix[5][9]*-1, row: 0},
      {label: "f", index: 6, profit: this.matrix[6][9]*-1, row: 0},
      {label: "g", index: 7, profit: this.matrix[7][9]*-1, row: 0},
      {label: "h", index: 8, profit: this.matrix[8][9]*-1, row: 0, fixed: true, x: this.svgWidth/2 + 200, y: 325},
      {label: "t", index: 9, profit: null, row: null, fixed: true, x: this.svgWidth/2, y: 100}
    ];

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

    this.links = [];
    this.node;
    this.edgepaths;
    this.edgelabels;
    this.link;
    this.restrictions = [];
    this.nodeLabelList = "abcdefghijklmnopqruvwxyz"
    this.innerNodeCount = 0;
    this.force;
    // this.tick.bind(this);
    //
  }



  renderGraph(){
    // let width = 900,
    //     height = 900;
    //
    // let animationInterval = 100;
    //
    // let matrix = [
    //   [0,1,1,1,0,0,0,0,0,0],
    //   [0,0,0,0,25,25,25,0,0,0],
    //   [0,0,0,0,0,25,25,25,0,0],
    //   [0,0,0,0,0,0,25,25,25,0],
    //   [0,0,0,0,0,0,0,0,0,1],
    //   [0,0,0,0,0,0,0,0,0,1],
    //   [0,0,0,0,0,0,0,0,0,1],
    //   [0,0,0,0,0,0,0,0,0,1],
    //   [0,0,0,0,0,0,0,0,0,1],
    //   [0,0,0,0,0,0,0,0,0,0]
    // ]
    //
    // let nodes = [
    //   {label: "s", index: 0, profit: null, row: null, fixed: true, x: width/2, y: height-100},
    //   {label: "a", index: 1, profit: matrix[0][1], row: 1, fixed: true, x: width/2-150, y: height - 325},
    //   {label: "b", index: 2, profit: matrix[0][2], row: 1},
    //   {label: "c", index: 3, profit: matrix[0][3], row: 1, fixed: true, x: width/2+150, y: height - 325},
    //   {label: "d", index: 4, profit: matrix[4][9]*-1, row: 0, fixed: true, x: width/2 - 200, y: 325},
    //   {label: "e", index: 5, profit: matrix[5][9]*-1, row: 0},
    //   {label: "f", index: 6, profit: matrix[6][9]*-1, row: 0},
    //   {label: "g", index: 7, profit: matrix[7][9]*-1, row: 0},
    //   {label: "h", index: 8, profit: matrix[8][9]*-1, row: 0, fixed: true, x: width/2 + 200, y: 325},
    //   {label: "t", index: 9, profit: null, row: null, fixed: true, x: width/2, y: 100}
    // ]
    //
    // let links = [
    // ]
    //
    // //defines the u -> v edges, i.e. must complete project v before starting project u
    // let restrictions = [
    //   {source: 1, target: 4},
    //   {source: 1, target: 5},
    //   {source: 1, target: 6},
    //   {source: 2, target: 5},
    //   {source: 2, target: 6},
    //   {source: 2, target: 7},
    //   {source: 3, target: 6},
    //   {source: 3, target: 7},
    //   {source: 3, target: 8},
    // ]
    //
    // //effectively the sum of all other capacities + 1 (commonly C + 1)
    // let infCapacity = 1000000;
    //
    // //computes C + 1
    // const simulateInfCapacity = () => {
    //   nodes.forEach(node => {
    //     if (node.profit !== null){
    //       if (node.profit > 0){
    //         infCapacity = infCapacity + node.profit
    //       }else{
    //         infCapacity = infCapacity - node.profit
    //       }
    //     }
    //   })
    //   infCapacity = infCapacity + 1;
    // }
    //
    // let linkIdIdx = 0;
    // //creates links with finite capacities
    // const setFiniteLinks = () => {
    //   nodes.forEach((node,i) => {
    //     //
    //     if (node.label !== "s" && node.label !== "t"){
    //       if (node.profit > 0){
    //         links.push({source: 0, target: i, res: 0, capacity: node.profit})
    //       }else{
    //         links.push({source: i, target: (nodes.length-1), capacity: (-1 * node.profit), res: 0, id: linkIdIdx})
    //       }
    //     }
    //     linkIdIdx = linkIdIdx + 1;
    //   })
    // }
    // //creates links with infinite capacities
    // const setInfiniteLinks = () => {
    //   restrictions.forEach(restriction => {
    //     links.push({source: restriction.source, target: restriction.target, res: 0, capacity: infCapacity, id: linkIdIdx})
    //     linkIdIdx = linkIdIdx + 1;
    //   })
    // }
    // // simulateInfCapacity();
    // setInfiniteLinks();
    // setFiniteLinks();
    //

    //create object for manipulation
    this.svgGraph = d3.select('body').append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight);

    //
    //apply force conditions

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
      this.link.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });


          this.edgepaths.attr('d', function(d) {
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
        //
        //     return `#linkId_${i}`;})
        //   .text(function(d) {
        //     return d.id;
        //   })

    //create links
    this.link = this.svgGraph.append("g").selectAll('.link')
        .data(this.links)
        .enter().append('line')
        .attr("class", "link")
        .attr('id', function(d) {
          return `link_${d.id}`})
        .style("stroke", function(d){
          if (d.capacity === this.infCapacity){
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
               if (d.capacity === this.infCapacity){
                 cap = `∞`
               }
               else{
                 cap = `${d.capacity}`
               }
               return `${d.res}:${cap}`});

  }

  // tick(e) {
  //   this;
  //
  //     this.node.attr('cx', function(d) {
  //         return d.x;
  //       })
  //       .attr('cy', function(d) { return d.y; })
  //       .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });
  //
  //     this.link.attr('x1', function(d) { return d.source.x; })
  //         .attr('y1', function(d) { return d.source.y; })
  //         .attr('x2', function(d) { return d.target.x; })
  //         .attr('y2', function(d) { return d.target.y; });
  //
  //
  //     this.edgepaths.attr('d', function(d) {
  //       let path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
  //       return path
  //     });
  //
  //     this.edgelabels.attr("transform", function(d,i){
  //       if (d.target.x < d.source.x){
  //         let bbox = this.getBBox();
  //         let rx = bbox.x + bbox.width/2;
  //         let ry = bbox.y + bbox.height/2;
  //         return `rotate(180 ${rx} ${ry})`;
  //       }
  //       else{
  //         return "rotate(0)";
  //       }
  //     })
  // }

}

/* harmony default export */ __webpack_exports__["default"] = (Graph);


/***/ }),

/***/ "./mineTest.js":
/*!*********************!*\
  !*** ./mineTest.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph.js */ "./graph.js");


class Mine {
  constructor(){
    this.mine = [
      // [
      //   {profit: -1, idx: 3},
      //   {profit: -1, idx: 4},
      //   {profit: -1, idx: 5},
      //   {profit: -1, idx: 6},
      //   {profit: -1, idx: 7}
      // ],
      // [
      //   {profit: null, idx: null},
      //   {profit: 1, idx: 0},
      //   {profit: 1, idx: 1},
      //   {profit: 1, idx: 2},
      //   {profit: null, idx: null}
      // ]
      // [
      //   {profit: -1, idx: 15},
      //   {profit: -1, idx: 16},
      //   {profit: -1, idx: 17},
      //   {profit: -1, idx: 18},
      //   {profit: -1, idx: 19}
      // ],
      [
        {profit: -1, idx: 8},
        {profit: -1, idx: 9},
        {profit: -1, idx: 10},
        {profit: -1, idx: 11},
        // {profit: -1, idx: 14}
      ],
      [
        {profit: 1, idx: 4},
        {profit: 1, idx: 5},
        {profit: 1, idx: 6},
        {profit: 1, idx: 7},
        // {profit: -1, idx: 9}
      ],
      [
        {profit: 1, idx: 0},
        {profit: 1, idx: 1},
        {profit: 1, idx: 2},
        {profit: 1, idx: 3},
        // {profit: 1, idx: 4}
      ]
    ];
    this.nodeLayers;
    this.updateNodeLayers(this.mine);
    this.numBlocks = 12;
    this.block;
    this.svg = d3.select("body").append("svg").attr("width", 700).attr("height", 900)
    this.blocks = [];
    this.blockSelectors = [{id: 0, color: "#FFD700", profit: 1}, {id: 1, color: "#8B4513", profit: -1}];
    this.currentBlockType =  {id: 1, color: "#8B4513", profit: -1};
    this.drawMine();
    this.addListeners();
    this.graph = new _graph_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.svg);
    this.graph.generateMatrixFromMine(this);
    this.graph.populateLinks();
    this.presentGraph();
    //
    // this.graph.generateMatrixFromMine(this);
    // this.graph.populateLinks(this.mine);
    // this.presentGraph();
  }

  updateNodeLayers(mine){
    const result = [];
    mine.forEach(row => {
      const rowEnds = [];
      let first = 0;
      while (first < row.length){
        if(row[first].profit !== null){
          rowEnds.push(row[first].idx);
          break;
        }
        first++;
      }
      let last = row.length-1;
      while (last > 0){
        if(row[last].profit !== null){
          rowEnds.push(row[last].idx);
          break;
        }
        last--;
      }
      result.push(rowEnds);
      // debugger
    })
    this.nodeLayers = result;
    debugger
  }

  drawMine(){
    // console.log(5);
    this.mine.forEach((row,i) => {
      row.forEach((block,j) => {
        let color;
        if (block.profit === null){
          color = "black";
        }else{
          color = this.blockSelectors.filter(obj => {
            return obj.profit === block.profit
          })[0].color
        }
        // debugger
        this.blocks.push({profit: block.profit, row: i, col: j, color})
      })
    })
    this.block = this.svg.selectAll(".block")
    .data(this.blocks)
    .enter().append("g")
    .attr("class","block")

    // debugger
    this.block.append("rect")
    .attr("x", function(d){
      return 100 + 100*d.col
    })
    .attr("y", function(d){
      return 200 + 100*d.row
    })
    .attr("id",function(d){
      return `rect:${d.row}-${d.col}`
    })
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill",function(d){
      if (d.profit === null){
        return "black"
      }
      else if (d.profit > 0){
        return "#FFD700"
      }else{
        return "#8B4513"
      }
    })
    .style("stroke","black")

    let circleSelector = this.svg.selectAll(".circleSelector")
    .data(this.blockSelectors)
    .enter().append("g")
    .attr("class","circleSelector")

    circleSelector.append("circle")
    .attr("id",function(d){
      return `circleSelector:${d.id}`
    })
    .attr("cx",function(d){
      return 100+d.id*100
    })
    .attr("cy",100)
    .attr("r",20)
    .attr("fill",function(d){
      // debugger
      return d.color
    })
  }

  presentGraph(){
    this.graph.renderGraph();
    // this.graph.addListeners();
  }

  addListeners(){
    this.blocks.forEach(block => {
      if (block.profit !== null){
        let tmpBlock = document.getElementById(`rect:${block.row}-${block.col}`)


        // let tmpColor;
        // tmpBlock.addEventListener("mouseover",(e) => {
        //   this.svg.selectAll("rect").filter(function(d){
        //     return `rect:${d.row}-${d.col}` === e.currentTarget.id;
        //   })
        //   .attr("fill","white");
        //   this.svg.selectAll(".block").attr("fill","white");
        // })
        //
        // tmpBlock.addEventListener("mouseout",(e) => {
        //   this.svg.selectAll("rect").filter(function(d){
        //     return `rect:${d.row}-${d.col}` === e.currentTarget.id;
        //   })
        //   .attr("fill","white");
        //   this.svg.selectAll(".block").attr("fill",function(d){
        //     debugger
        //   });
        // })

        tmpBlock.addEventListener("click", e => {
          // debugger
          this.svg.selectAll("rect").filter(function(d){
            // debugger
            return `rect:${d.row}-${d.col}` === e.currentTarget.id;
          })
          .attr("fill",this.currentBlockType.color);


          let indices = e.currentTarget.id.split(":")[1].split("-");
          // debugger
          this.mine[Number(indices[0])][Number(indices[1])].profit = this.currentBlockType.profit;


          this.graph.clearGraph();
          this.graph.generateMatrixFromMine(this);
          this.graph.populateLinks();
          this.presentGraph();

          // debugger
          // this.svg.selectAll(".block").attr("fill","white");
        })
        //
      }
      })
      this.blockSelectors.forEach(selector => {
        // debugger
        let tmpSelector = document.getElementById(`circleSelector:${selector.id}`)
        tmpSelector.addEventListener("click", e => {
          // debugger

          this.svg.selectAll(".circleSelector")
          .style("stroke-width", "3")
          .style("stroke",(d) => {
            if (e.currentTarget.id.split(":")[1] === `${d.id}`){
              this.currentBlockType = d;
              // debugger
              return "red";
            }else{
              // debugger
              return "none";
            }
            // debugger
          })
          // debugger
        }
    )}
  )}
}

/* harmony default export */ __webpack_exports__["default"] = (Mine);


/***/ }),

/***/ "./miner.js":
/*!******************!*\
  !*** ./miner.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mineTest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mineTest.js */ "./mineTest.js");
/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./graph.js */ "./graph.js");
/* harmony import */ var _graph2_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./graph2.js */ "./graph2.js");
// // const Vertex = require("./vertex.js");
// const Vertex = require("./vertex.js");
//
// // import Vertex from "./vertex.js";
//
// document.addEventListener("DOMContentLoaded", () => {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//
//   // const Vertex = function(x,y,r){
//   //   this.x = x,
//   //   this.y = y,
//   //   this.r = r
//   // }
//   //
//   // Vertex.prototype.render = function(ctx){
//   //   ctx.beginPath();
//   //   ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
//   //   ctx.fillStyle = "red";
//   //   ctx.fill();
//   // }
//
//   const Edge = function(v1, v2){
//     this.v1 = v1;
//     this.v2 = v2;
//   }
//
//   Edge.prototype.render = function(ctx){
//     ctx.beginPath();
//     ctx.moveTo(this.v1.x,this.v1.y);
//     ctx.lineTo(this.v2.x,this.v2.y);
//     ctx.lineWidth = 10;
//     ctx.strokeStyle = "purple";
//     ctx.stroke();
//   }
//
//   const EdgeArrow = function(v1,v2){
//
//   }
//
//   const matrix = [
//     [0,0,1,1,1,0],
//     [0,0,0,1,1,1],
//     [0,0,0,0,0,0],
//     [0,0,0,0,0,0],
//     [0,0,0,0,0,0],
//     [0,0,0,0,0,0]
//   ]
//
//   const vertices = [
//     new Vertex(300,300,20),
//     new Vertex(500,300,20),
//
//     new Vertex(100,100,20),
//     new Vertex(300,100,20),
//     new Vertex(500,100,20),
//     new Vertex(700,100,20)
//   ]
//   const edges = [];
//
//   const generateEdgesFromMatrix = function(matrix){
//     matrix.forEach((row, i) => {
//       row.forEach((el, j) => {
//         if (el > 0){
//           edges.push(new Edge(vertices[i],vertices[j]));
//         }
//       })
//     })
//   }
//
//   generateEdgesFromMatrix(matrix);
//
//
//   // const edges = [
//   //   new Edge(vertices[4],vertices[0]),
//   //   new Edge(vertices[4],vertices[1]),
//   //   new Edge(vertices[4],vertices[2]),
//   //   new Edge(vertices[5],vertices[1]),
//   //   new Edge(vertices[5],vertices[2]),
//   //   new Edge(vertices[5],vertices[3])
//   // ]
//
//   edges.forEach((edge) => {
//     edge.render(ctx);
//   })
//
//   vertices.forEach((vertex) => {
//     vertex.render(ctx);
//   })
//
//   // v1.render(ctx);
//   // v2.render(ctx);
//   // v3.render(ctx);
//   // v4.render(ctx);
//   // v5.render(ctx);
//   // v6.render(ctx);
//
// });

// document.addEventListener("DOMContentLoaded", () => {
//
//   var svg = d3.select("svg"),
//       width = +svg.attr("width"),
//       height = +svg.attr("height");
//
//
//               var simulation = d3.forceSimulation()
//                   .force("link", d3.forceLink().id(function(d) { return d.id; }))
//                   //.force("charge", d3.forceManyBody().strength(-200))
//               		.force('charge', d3.forceManyBody()
//                     .strength(-1000)
//                   )
//               // 		.force('collide', d3.forceCollide()
//               //       .radius(d => 40)
//               //       .iterations(2)
//               //     )
//                   .force("center", d3.forceCenter(width / 2, height / 2));
//               const graph = {
//                 "nodes": [
//                   {"id": "1", "group": 1},
//                   {"id": "2", "group": 2},
//                 ],
//                 "links": [
//                   {"source": "1", "target": "2", "value": 1},
//                 ]
//               }
//
//
//               function run(graph) {
//
//                 graph.links.forEach(function(d){
//               //     d.source = d.source_id;
//               //     d.target = d.target_id;
//                 });
//                 var link = svg.append("g")
//                               .style("stroke", "#aaa")
//                               .selectAll("line")
//                               .data(graph.links)
//                               .enter().append("line");
//                 var node = svg.append("g")
//                           .attr("class", "nodes")
//                 .selectAll("circle")
//                           .data(graph.nodes)
//                 .enter().append("circle")
//                         .attr("r", 2)
//
//
//                 var label = svg.append("g")
//                     .attr("class", "labels")
//                     .selectAll("text")
//                     .data(graph.nodes)
//                     .enter().append("text")
//                       .attr("class", "label")
//                       .text(function(d) { return d.id; });
//                 simulation
//                     .nodes(graph.nodes)
//                     .on("tick", ticked);
//                 simulation.force("link")
//                     .links(graph.links);
//                 function ticked() {
//                   link
//                       .attr("x1", function(d) { return d.source.x; })
//                       .attr("y1", function(d) { return d.source.y; })
//                       .attr("x2", function(d) { return d.target.x; })
//                       .attr("y2", function(d) { return d.target.y; });
//                   node
//                        .attr("r", 16)
//                        .style("fill", "#efefef")
//                        .style("stroke", "#424242")
//                        .style("stroke-width", "1px")
//                        .attr("cx", function (d) { return d.x+5; })
//                        .attr("cy", function(d) { return d.y-3; });
//                 }
//               }
//
//
//               run(graph)
//
//
// });


const draw = __webpack_require__(/*! ./test3.js */ "./test3.js");



document.addEventListener("DOMContentLoaded", () => {
  // let graph2 = new Graph2();
  // graph2.renderGraph();
  // draw();
  let mine = new _mineTest_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  // mine.drawMine();
  // let graph = new Graph();
  // draw2();
});


/***/ }),

/***/ "./solver.js":
/*!*******************!*\
  !*** ./solver.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Solver {
  constructor(stepping, playback, count, matrix, parent, max_flow, svgGraph, mineSvg){
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
    this.animationInterval = 500;
    this.mineSvg = mineSvg;
  }

  setup(){
    this.svgGraph.append("rect")
    .attr("id","step")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "orange")

    this.svgGraph.append("rect")
    .attr("id","play")
    .attr("x", 70)
    .attr("y", 10)
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "green")

    this.svgGraph.append("rect")
    .attr("id","pause")
    .attr("x", 130)
    .attr("y", 10)
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "red")

    this.addListeners();
  }

  addListeners(){
    let playButton = document.getElementById("play");
    playButton.addEventListener("click", e => {
      if (!this.stepping) {
        // this.solver.step();
        this.step();
      }
      this.playback = true;
    })

    let stepButton = document.getElementById("step");
    stepButton.addEventListener("click", e => {
      this.step();
    })

    let pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", e => {
      // this.solver.playback = false;
      this.playback = false;
    })
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
      }
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
        if (solution.includes(this.findIndexFromRowCol(d.row,d.col))){
          return "black"
        }else{
          return "white"
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
    return 4 * (2-row) + (col + 1)
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
          if (d.capacity === this.infCapacity){
            return "#444444"
          }else if (d.target.label === "t"){
            return "#8b4516"
          }else if ( d.source.label === "s"){
            return "#ffd724"
          }
        })

        this.mineSvg.selectAll("rect")
        .filter((d) => {
          return this.findIndexFromRowCol(d.row,d.col) === path[i+1]
        })
        .transition()
        .duration(this.animationInterval)
        .attr("fill", (d)=>{
          return d.color;
        })
      }, this.animationInterval*count)
    }
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Solver);


/***/ }),

/***/ "./test3.js":
/*!******************!*\
  !*** ./test3.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

// const EK = require("./ek-animated.js");


const draw3 = function(){
  let width = 900,
      height = 900;

  animationInterval = 500;

  let matrix = [
    [0,5,2,2,0,0,0,0,0,0],
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
  infCapacity = 1000000;

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
      //
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
  // simulateInfCapacity();
  setInfiniteLinks();
  setFiniteLinks();
  //

  //create object for manipulation
  let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);

  //
  //apply force conditions

  let force = d3.layout.force()
      .size([width, height])
      .nodes(d3.values(nodes))
      .links(links)
      .on("tick", () => {
        debugger
        node.attr('cx', function(d) {
          debugger
            return d.x;
          })
          .attr('cy', function(d) { return d.y; })
          .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });

    debugger
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
      })
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
      //
      //     return `#linkId_${i}`;})
      //   .text(function(d) {
      //     return d.id;
      //   })

  //create links
  let link = svg.append("g").selectAll('.link')
      .data(links)
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
      .data(nodes)
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
      .attr("class","nodeLabel")
      .attr("dx", "-.2em")
      .attr("dy", ".35em")
      .style("fill", "white")
      .text(function(d) {return d.label})

  let edgepaths = svg.selectAll(".edgepath")
      .data(links)
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
  //
  //
       edgelabels.append('textPath')
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

       svg.append("rect")
       .attr("id","step")
       .attr("x", 10)
       .attr("y", 10)
       .attr("width", 50)
       .attr("height", 50)
       .attr("fill", "white")

       svg.append("rect")
       .attr("id","play")
       .attr("x", 70)
       .attr("y", 10)
       .attr("width", 50)
       .attr("height", 50)
       .attr("fill", "orange")

       svg.append("rect")
       .attr("id","pause")
       .attr("x", 130)
       .attr("y", 10)
       .attr("width", 50)
       .attr("height", 50)
       .attr("fill", "red")

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

  // function tick(e) {
  //     node.attr('cx', function(d) {
  //
  //         return d.x;
  //       })
  //       .attr('cy', function(d) { return d.y; })
  //       .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });
  //
  //     link.attr('x1', function(d) { return d.source.x; })
  //         .attr('y1', function(d) { return d.source.y; })
  //         .attr('x2', function(d) { return d.target.x; })
  //         .attr('y2', function(d) { return d.target.y; });
  //
  //
  //     edgepaths.attr('d', function(d) {
  //       let path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
  //       return path
  //     });
  //
  //     // edgelabels.attr('transform',function(d,i){
  //     //     if (d.target.x<d.source.x){
  //     //         bbox = this.getBBox();
  //     //         rx = bbox.x+bbox.width/2;
  //     //         ry = bbox.y+bbox.height/2;
  //     //         return 'rotate(180 '+rx+' '+ry+')';
  //     //         }
  //     //     else {
  //     //         return 'rotate(0)';
  //     //         }
  //     // });
  //
  //     edgelabels.attr("transform", function(d,i){
  //       if (d.target.x < d.source.x){
  //         bbox = this.getBBox();
  //         rx = bbox.x + bbox.width/2;
  //         ry = bbox.y + bbox.height/2;
  //         return `rotate(180 ${rx} ${ry})`;
  //       }
  //       else{
  //         return "rotate(0)";
  //       }
  //     })
  // }


  const BFS = (graph, s, t, parent) => {
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

  let parent = [];

  for (let i = 0; i < matrix.length; i++){
    parent.push(-1);
  }

  let count = 0;
  let max_flow = 0;
  let cont = true;
  let playback = false;
  let stepping = false;

  const step = () => {
    stepping = true;
    debugger
    count = 0;
    graph = matrix;
    source = 0;
    sink = 9;
    if (BFS(graph, source, sink, parent).pathToSink){
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        path_flow = Math.min(path_flow, graph[parent[s]][s]);
        s = parent[s];
        path.unshift(s);
      }
      //
      animatePath(path, count, "search");
      max_flow = max_flow + path_flow;
      //
      count = count + (path.length - 1);

      let t = sink;
      let augmentingPath = [t];
      while (t != source){
        let u = parent[t];
        graph[u][t] =  graph[u][t] - path_flow;
        graph[t][u] = graph[t][u] + path_flow;
        let z = graph[u][t];
        animateAugment(u,t,count,graph);
        count = count + 1;
        //
        // updateCapacities(u,t,count);
        t = parent[t];
        augmentingPath.push(t)
      }
      // animatePath(augmentingPath, count, "augment",graph)

      // count = count + (path.length - 1);
      //

      resetBFSLinks(path, count);

      count = count + 1;
      setTimeout(() => {
        stepping = false;
        if (playback){
          debugger
          count = count + 1;
            step()
        }
        // else{
        //   count = 0;
        // }
      }, count*animationInterval);
    }
  }


  const EK = (graph, source, sink) => {

    while (BFS(graph, source, sink, parent).pathToSink) {
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        path_flow = Math.min(path_flow, graph[parent[s]][s]);
        s = parent[s];
        path.unshift(s);
      }
      //
      animatePath(path, count, "search");
      max_flow = max_flow + path_flow;
      //
      count = count + (path.length - 1);

      let t = sink;
      let augmentingPath = [t];
      while (t != source){
        let u = parent[t];
        graph[u][t] =  graph[u][t] - path_flow;
        graph[t][u] = graph[t][u] + path_flow;
        let z = graph[u][t];
        animateAugment(u,t,count,graph);
        count = count + 1;
        //
        // updateCapacities(u,t,count);
        t = parent[t];
        augmentingPath.push(t)
      }
      // animatePath(augmentingPath, count, "augment",graph)

      // count = count + (path.length - 1);
      //

      resetBFSLinks(path, count);
      count = count + 1;
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
    count = count + 1;


    return {max_flow, solution,count,solutionEdges};
  }

  function addListeners(){
    let playButton = document.getElementById("play");
    playButton.addEventListener("click", e => {
      if (!stepping) {
        step();
      }
      playback = true;
    })

    let stepButton = document.getElementById("step");
    stepButton.addEventListener("click", e => {
      step();
    })

    let pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", e => {
      playback = false;
    })
  }

  addListeners();
  // step();

  // let node.enter().append("text")



  ///USEFUL STUFF RIGHT HERE
  // setTimeout(function(){
  //   svg.selectAll("textPath")
  //   .filter(function(d){
  //     //
  //     return d.source.index === 0 && d.target.index === 1;
  //   })
  //   .text("4")
  // },1000);
  //


  let result;
  // highlightSolution(result.solution, result.count, result.solutionEdges);


  function updateCapacities(source,target,count,graph){
    //
    setTimeout(function(){
      //
      svg.selectAll("textPath")
      .filter(function(d){
        //
        return d.source.index === source && d.target.index === target;
      })
      .text(function(d){
        //
        let cap;
        if (d.capacity === infCapacity){
          cap = `∞`
        }
        else{
          cap = `${d.capacity}`
        }
        //
        return `${d.capacity - graph[source][target]}:${cap}`
      }
    )
    },animationInterval/2);
  }

  function pathMatch(tmpArr, solutionArr){
    let result = false;
    solutionArr.forEach(arr => {
      if (tmpArr[0] === arr[0] && tmpArr[1] === arr[1]){
        result = true;
      }
    })
    return result;
  }

  function highlightSolution(solution, count, solutionEdges){
    setTimeout(function(){
      svg.selectAll("circle")
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

      svg.selectAll("text")
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

      // svg.selectAll(".link").filter(function(d) {
      //   let tmp = [d.source.index,d.target.index];
      //   //
      //   pathMatch(tmp,solutionEdges)
      //   return pathMatch(tmp,solutionEdges);
      // })
      // .transition()
      // .duration(1000)
      // .style("stroke", "red")
    },animationInterval*count)
  }

  function animateAugment(source,target,count,graph){
    // updateCapacities(source,target,count,graph);
    setTimeout(function(){
      svg.selectAll(".link")
      .filter(function(d){

        //
        if (d.source.index === source && d.target.index === target){
          //
          updateCapacities(d.source.index, d.target.index,count,graph);
          return true;
        // return d.source.index === path[i+1] && d.target.index === path[i]
        }
      })
      .transition()
      .duration(animationInterval)
      .style("stroke", function(){
          return "#039ab5"
      })
    }, animationInterval*count)
  }

  function animatePath(path, count, type,graph) {
    for (let i = 0; i < path.length - 1; i++){
      setTimeout(function(){
        svg.selectAll(".link")
        .filter(function(d){
          if (type === "search"){
            return d.source.index === path[i] && d.target.index === path[i+1]
          }else{
            if (d.source.index === path[i+1] && d.target.index === path[i]){
              //
              updateCapacities(d.source.index, d.target.index,count,graph);
              return true;
            }
            // return d.source.index === path[i+1] && d.target.index === path[i]
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
      //
    }

  }

  function resetBFSLinks(path,count){
    for (let i = 0; i < path.length - 1; i++){
      setTimeout(function(){
        svg.selectAll(".link")
        .filter(function(d){
          //
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


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map