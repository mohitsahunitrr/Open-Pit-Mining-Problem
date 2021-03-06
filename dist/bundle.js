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
    this.svgWidth = 820;
    this.svgHeight = window.innerHeight-250;
    this.svgGraph = d3.select(".svgGraphBody").append("svg").attr("class","svgGraph").attr("width", this.svgWidth).attr("height", this.svgHeight);
    this.nodes = [];
    this.links = [];
    this.node;
    this.edgepaths;
    this.edgelabels;
    this.link;
    this.nodeLabelList = "abcdefghijklmnopqruvwxyz"
    this.innerNodeCount;
    this.force;
    this.animationInterval = 1000;
    this.parent = [];

    this.count = 0;
    this.max_flow = 0;
    this.cont = true;
    this.playback = false;
    this.stepping = false;
    // 
    this.solver;// = new Solver();
    this.currentProfit;
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
    if (i === 0) return [];
    return [[i-1,j],[i-1,j+1]]
  }

  findNodeNum(i,j,mine){
    return 1 + mine[i][j].idx;
  }

  generateMatrixFromMine(mineObj){
    this.mine = mineObj.mine;
    
    const matrixSize = mineObj.numBlocks + 2;
    this.populateMatrix(matrixSize);
    // this.innerNodeCount = 0;
    let nodeLayers = mineObj.nodeLayers;
    // this.mineH = mine.length;
    // this.mineW = mine[0].length;
    this.mine.forEach((row,i) => {
      let tmpRow = row.slice();
      tmpRow.forEach((el, j) => {
        // 
        if (el.profit !== null){
          // this.innerNodeCount++;
          let newPos = this.findNodeNum(i,j,this.mine);
          if (el.profit > 0) this.matrix[0][newPos] = el.profit;
          else if (el.profit < 0) this.matrix[newPos][this.matrix.length - 1] = (-1*el.profit);
          let aboves = this.findBlocksAbove(i,j,this.mine);
          // 
          aboves.forEach(pos => {
            el;
            mineObj;
            // 
            let intRow = this.findNodeNum(i,j,this.mine);
            let intCol = this.findNodeNum(pos[0],pos[1],this.mine);
            this.matrix[intRow][intCol] = this.infCapacity;
          })
        }
      })
    })
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
          if (nodeLayers[i][0] === el.idx){
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: this.svgWidth/8, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          }else if (nodeLayers[i][1] === el.idx){
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: 7*this.svgWidth/8, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          }else{
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit});
          }
        }
      })
    })
    this.nodes.unshift({label: "s", index: 0, profit: null, fixed: true, x: this.svgWidth/2, y: this.svgHeight-25});
    this.nodes.push({label: "t", index: matrixSize-1, profit: null, fixed: true, x: this.svgWidth/2, y: 50});
    ;
  }

  populateLinks(){
    let linkId = 0;
    // 
    this.matrix.forEach((row,i) => {
      row.forEach((el,j) => {
        if (el > 0){
          // 
          this.links.push({source: i, target: j, res: 0, capacity: el, id: linkId});
          linkId = linkId + 1;
        }
      })
    })
    
  }

  passProfit(profit){
    
    this.solver.currentProfit = this.solver.currentProfit + profit;
  }

  renderGraph(){
    this.force = d3.layout.force()
    .size([this.svgWidth, this.svgHeight])
    .nodes(d3.values(this.nodes))
    .links(this.links)
    .on("tick", () => {
      // 
      this.node.attr('cx', function(d) {
        // 
        return d.x;
      })
      .attr('cy', function(d) { return d.y; })
      .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });

      // 
      this.link.attr('x1', function(d) {
        // 
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
    .gravity(0.1)
    .charge(-1200)
    // .linkDistance(100)
    .linkStrength(0.4)
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
          if (d.capacity === 3){
            return "url(#rust)"
          }else{
            return "url(#stone)"
          }
          // return "#8B4513"
        }else if ( d.source.label === "s"){
          if (d.capacity === 5){
            return "url(#gold)"
          }else{
            return "url(#silver)"
          }
          // return "#FFD700"
        }
      })
      .attr("marker-end","url(#arrowhead)")
      .style("stroke-width", d => {
        if (d.capacity === infCapacity) return 4;
        else return 8
      })

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
        // 
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
      'dy':-7,
      'font-size':20,
      'fill':'#ccc'});
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
                 'refX':50,
                 'refY':0,
                 //'markerUnits':'strokeWidth',
                 'orient':'auto',
                 'markerWidth':3,
                 'markerHeight':3,
                 'xoverflow':'visible'})
          .append('svg:path')
              .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
              .attr('fill', '#ccc')

    
    this.addListeners();
    this.solver = new _solver_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.stepping, this.playback, this.count, this.matrix, this.parent, this.max_flow, this.svgGraph, this.mineSvg, this.mine, this.currentProfit);
  }

  addListeners(){
    // document.getElementById("step-animation").onclick = () => this.addRow();
    // document.getElementById("play-animation").onclick = () => this.removeRow();
    // document.getElementById("stop-animation").onclick = () => this.reset();
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
          // 
          this.node.attr('cx', function(d) {
            // 
              return d.x;
            })
            .attr('cy', function(d) { return d.y; })
            .attr("transform", function(d) { return `translate(${d.x},${d.y})`; });

      // 
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
    this.mineIndex = 2;
    this.mineOptions = [
      [
        [
          {profit: -3, idx: 7},
          {profit: -1, idx: 8},
          {profit: -3, idx: 9},
          {profit: -3, idx: 10},
          {profit: -3, idx: 11},
          // {profit: -2, idx: 14}
        ],
        [
          {profit: -1, idx: 3},
          {profit: 2, idx: 4},
          {profit: 5, idx: 5},
          {profit: 5, idx: 6},
          // {profit: -1, idx: 9}
        ],
        [
          {profit: 5, idx: 0},
          {profit: 5, idx: 1},
          {profit: 2, idx: 2},
          // {profit: 1, idx: 4}
        ]
      ],
      [
        [
          {profit: -3, idx: 7},
          {profit: 5, idx: 8},
          {profit: -1, idx: 9},
          {profit: -1, idx: 10},
          {profit: -3, idx: 11},
          // {profit: -2, idx: 14}
        ],
        [
          {profit: -1, idx: 3},
          {profit: -3, idx: 4},
          {profit: 5, idx: 5},
          {profit: 5, idx: 6},
          // {profit: -1, idx: 9}
        ],
        [
          {profit: -1, idx: 0},
          {profit: 5, idx: 1},
          {profit: 2, idx: 2},
          // {profit: 1, idx: 4}
        ]
      ],
      [
        [
          {profit: -1, idx: 7},
          {profit: -1, idx: 8},
          {profit: -3, idx: 9},
          {profit: 2, idx: 10},
          {profit: 2, idx: 11},
          // {profit: -2, idx: 14}
        ],
        [
          {profit: 5, idx: 3},
          {profit: -3, idx: 4},
          {profit: 5, idx: 5},
          {profit: -1, idx: 6},
          // {profit: -1, idx: 9}
        ],
        [
          {profit: -1, idx: 0},
          {profit: 2, idx: 1},
          {profit: 5, idx: 2},
          // {profit: 1, idx: 4}
        ]
      ]
    ]
    this.mine = this.mineOptions[this.mineIndex]
    // [
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


      // [
      //   {profit: -1, idx: 12},
      //   {profit: -1, idx: 13},
      //   {profit: -1, idx: 14},
      //   {profit: -1, idx: 15},
      //   {profit: -1, idx: 16},
      //   {profit: -1, idx: 17},
      //   // {profit: -1, idx: 14}
      // ],
    //   [
    //     {profit: -3, idx: 7},
    //     {profit: -1, idx: 8},
    //     {profit: -3, idx: 9},
    //     {profit: -3, idx: 10},
    //     {profit: -3, idx: 11},
    //     // {profit: -2, idx: 14}
    //   ],
    //   [
    //     {profit: -1, idx: 3},
    //     {profit: 2, idx: 4},
    //     {profit: 5, idx: 5},
    //     {profit: 5, idx: 6},
    //     // {profit: -1, idx: 9}
    //   ],
    //   [
    //     {profit: 5, idx: 0},
    //     {profit: 5, idx: 1},
    //     {profit: 2, idx: 2},
    //     // {profit: 1, idx: 4}
    //   ]
    // ];
    this.guessStack = [];
    this.profitStack = [];
    this.currentProfit = 0;
    this.guessing = true;
    this.blockLabelList = "abcdefghijklmnopqruvwxyz"
    this.nodeLayers;
    this.updateNodeLayers(this.mine);
    //
    this.numBlocks = 0;
    this.findNumBlocks();
    this.block;
    this.svg = d3.select(".svgMineBody").append("svg").attr("class","mineSvg").attr("width", 700).attr("height", 503)
    this.svgKeys = d3.select(".svgKeys").append("svg").attr("class","keysSvg").attr("width", 700).attr("height", 110)
    this.blocks = [];
    this.blockSelectors = [
      {id: 0, color: "#FFD700", profit: 5, type: "selector", texture: "gold"},
      {id: 1, color: "#c8c8c8", profit: 2, type: "selector", texture: "silver"},
      {id: 2, color: "#bdad9c", profit: -1, type: "selector", texture: "stone"},
      {id: 3, color: "#8B4513", profit: -3, type: "selector", texture: "rust"},
      // {id: 3, color: "#8B4513", profit: -1, type: "selector", texture: "rust"}
    ];
    this.currentBlockType = this.blockSelectors[1];
    this.drawMine();
    // this.addListeners();
    this.graph = new _graph_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.svg);
    this.graph.generateMatrixFromMine(this);
    this.graph.populateLinks();
    this.presentGraph();
    // this.graph.generateMatrixFromMine(this);
    //
    // this.graph.populateLinks(this.mine);
    // this.presentGraph();
  }

  findNumBlocks(){
    this.numBlocks = 0;
    this.mine.forEach(row=>{
      row.forEach(() => this.numBlocks++)
    });
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
      //
    })
    this.nodeLayers = result;
    //
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

  drawMine(){
    let defs = this.svg.append("defs");

    defs.append("pattern")
    .attr("id", "gold")
    .attr("height","100%")
    .attr("width","100%")
    .attr("patternContentUnits","objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href","gold.jpg");
    defs.append("pattern")
    .attr("id", "rust")
    .attr("height","100%")
    .attr("width","100%")
    .attr("patternContentUnits","objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href","rust.jpeg");
    defs.append("pattern")
    .attr("id", "silver")
    .attr("height","100%")
    .attr("width","100%")
    .attr("patternContentUnits","objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href","silver.jpg");
    defs.append("pattern")
    .attr("id", "stone")
    .attr("height","100%")
    .attr("width","100%")
    .attr("patternContentUnits","objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "none")
    .attr("xlink:href","stone.jpg");
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
        //
        this.blocks.push({profit: block.profit, row: i, col: j, color, type: block, border: "black"})
      })
    })

    let width = 50;
    this.mine

    this.block = this.svg.selectAll(".block")
    .data(this.blocks)
    .enter().append("g")
    .attr("class","block")

    this.svg.append("text")
    .attr("class","profit")
    .attr("transform", d => {
      return `translate(${120}, ${60})`
    })
    .attr("id", `profit`)
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => "white")
    .text((d) => `Your Current Profit: $${this.currentProfit}k`)
    .style("font-weight", 600)
    .style("font-size", 24)
    .style("stroke-width",0)

    this.svg.append("text")
    .attr("class","maxProfit")
    .attr("transform", d => {
      return `translate(${-1000}, ${45})`
    })
    .attr("id", `maxProfit`)
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => "white")
    .text((d) => "")
    .style("font-weight", 600)
    .style("font-size", 24)
    .style("stroke-width",0)

    this.svg.append("text")
    .attr("class","profitSummary")
    .attr("transform", d => {
      return `translate(${-1000}, ${70})`
    })
    .attr("id", `profitSummary`)
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => "white")
    .text((d) => "")
    .style("font-weight", 600)
    .style("font-size", 24)
    .style("stroke-width",0)

    //
    this.block.append("rect")
    .attr("x", (d) => {
      return 100 + d.row*50 + 102*d.col + (3 - this.mine.length)*50
    })
    .attr("y", function(d){
      return 198 + 102*d.row
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
      else if (d.profit === 5){
        return "url(#gold)"
      }else if (d.profit === -3){
        return "url(#rust)"
      }else if (d.profit === 2){
        return "url(#silver)"
      }else if (d.profit === -1){
        return "url(#stone)"
      }
    })
    .style("stroke","black")
    .style("stroke-width", 2)

    this.block.append("text")
    .attr("class","blockLabel")
    .attr("transform", d => {
      return `translate(${100 + d.row*50 + 100*d.col + (3 - this.mine.length)*50}, ${200 + 100*d.row})`
    })
    .attr("id",function(d){
      return `blockLabel:${d.row}-${d.col}`
    })
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => {
      if (d.profit > 0) return "green"
      else return "red"
    })
    .text((d) => {

      return this.blockLabelList[this.findIndexFromRowCol(d.row,d.col)-1]})
    .style("font-weight", 600)
    .style("font-size", 24)


    let circleSelector = this.svgKeys.selectAll(".circleSelector")
    .data(this.blockSelectors)
    .enter().append("g")
    .attr("class","circleSelector")

    circleSelector.append("circle")
    .attr("id",function(d){return `circleSelector:${d.id}`})
    .attr("cx",function(d){return 250+d.id*100})
    .attr("cy", 50)
    .attr("r",20)
    .attr("fill",function(d){
      return `url(#${d.texture})`
    })

    // circleSelector.filter(d => d.id === 1)
    // .style("stroke", "red")
    // .style("stroke-width", 3);

    circleSelector.append("text")
    .attr("class","selectorLabel")
    .attr("transform", d => {
      return `translate(${150+d.id*100}, ${75})`
    })
    .attr("id",function(d){
      return `selectorLabel:${d.id}`
    })
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => {
      if (d.profit > 0) return "green";
      else return "red";
    })
    .text((d) => {
      if (d.profit > 0){
        return `+$${d.profit}k`
      }else{
        return `-$${-1 * d.profit}k`
      }
    })
    .style("font-weight", 600)
    .style("font-size", 24)
    .style("stroke-width",0)

    circleSelector.append("text")
    .attr("class","selectorLabel")
    .attr("transform", d => {
      return `translate(${165+d.id*100}, ${0})`
    })
    .attr("id",function(d){
      return `selectorLabel:${d.id}`
    })
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => `url(#${d.texture})`)
    .text((d) => {
      if (d.profit === 5){
        return "Gold"
      }else if (d.profit === 2){
        return "Silver"
      }else if (d.profit === -1){
        return "Stone"
      }else if (d.profit === -3){
        return "Rust"
      }
    })
    .style("font-weight", 600)
    .style("font-size", 20)
    .style("stroke-width",0)

    circleSelector.filter(d => d.profit === 5)
    .append("text")
    .attr("class","selectorLabel")
    .attr("transform", d => {
      return `translate(${50}, ${25})`
    })
    .attr("id",function(d){
      return `selector-instructions`
    })
    .attr("dx", "3.2em")
    .attr("dy", "1em")
    .style("fill", d => "white")
    .text((d) => {
      return "Key:"
    })
    .style("font-weight", 400)
    .style("font-size", 24)
    .style("stroke-width",0)

    // circleSelector.filter(d => d.profit === 5)
    // .append("text")
    // .attr("class","selectorLabel")
    // .attr("transform", d => {
    //   return `translate(${-50}, ${50})`
    // })
    // .attr("id",function(d){
    //   return `selector-instructions`
    // })
    // .attr("dx", "3.2em")
    // .attr("dy", "1em")
    // .style("fill", d => "white")
    // .text((d) => {
    //   return "clicking a button to the right and"
    // })
    // .style("font-weight", 400)
    // .style("font-size", 18)
    // .style("stroke-width",0)
    //
    // circleSelector.filter(d => d.profit === 5)
    // .append("text")
    // .attr("class","selectorLabel")
    // .attr("transform", d => {
    //   return `translate(${-50}, ${75})`
    // })
    // .attr("id",function(d){
    //   return `selector-instructions`
    // })
    // .attr("dx", "3.2em")
    // .attr("dy", "1em")
    // .style("fill", d => "white")
    // .text((d) => {
    //   return "selecting specific blocks below"
    // })
    // .style("font-weight", 400)
    // .style("font-size", 18)
    // .style("stroke-width",0)

   //  let invisiNodes = [
   //    {x: 650, y: 0},
   //    {x: 650, y: 50}
   //  ]
   //  //
   //
   //  let invisiNode = this.svg.selectAll('.node')
   //  .data(invisiNodes)
   //  .enter().append('circle')
   //  .attr('class', 'node');
   //
   //  let links = [
   //    { source: 0, target: 1 }
   //  ];
   //
   //  invisiNode.attr('r', 0)
   //     .attr('cx', function(d) { return d.x; })
   //     .attr('cy', function(d) { return d.y; });
   //
   //  let link = this.svg.append('g').selectAll('.link')
   //  .data(links)
   //  .enter().append("line")
   //  .attr('class', 'link')
   //  .style("stroke","white")
   //  .style("stroke-width", 3)
   //  .attr("marker-end","url(#arrowheadMine)")
   //  //
   //
   //  link.attr('x1', 650)
   //     .attr('y1', 125)
   //     .attr('x2', 650)
   //     .attr('y2', 400);
   //
   // defs.append('marker')
   //     .attr({'id':'arrowheadMine',
   //            'viewBox':'-0 -5 10 10',
   //            'refX':0,
   //            'refY':0,
   //            //'markerUnits':'strokeWidth',
   //            'orient':'auto',
   //            'markerWidth':10,
   //            'markerHeight':10,
   //            'xoverflow':'visible'})
   //     .append('svg:path')
   //         .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
   //         .attr('fill', '#fff')
   //
   //         let edgepaths = this.svg.selectAll(".edgepath")
   //         .data(links)
   //         .enter()
   //         .append('path')
   //         .attr({'d': function(d) {
   //           //
   //         return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
   //         'class':'edgepathMine',
   //         'fill-opacity':0,
   //         'stroke-opacity':0,
   //         'fill':'blue',
   //         'stroke':'red',
   //         'id':function(d,i) {return `edgepath:depth`}})
   //         .style("pointer-events", "none");
   //         //
   //         let edgelabels = this.svg.selectAll(".edgelabelMine")
   //         .data(links)
   //         .enter()
   //         .append('text')
   //         .style("pointer-events", "none")
   //         .attr({'class':'edgelabelMine',
   //         'id':function(d){return 'edgelabelMine'},
   //         'dx':80,
   //         'dy':-7,
   //         'font-size':20,
   //         'fill':'#ccc'});
   //         //
   //         //
   //         edgelabels.append('textPath')
   //         .attr('xlink:href',function(d,i) {
   //           //
   //           return `#edgepath:depth`})
   //           // return '#edgepath'+i})
   //           .style("pointer-events", "none")
   //           .text("heeey");

    // .attr("fill",function(d){return d.color})
    //
    // this.svg.append("circle")
    // .attr("id","addRow")
    // .attr("cx", 250)
    // .attr("cy", 35)
    // .attr("r", 25)
    // .attr("fill", "green")
    //
    // this.svg.append("circle")
    // .attr("id","removeRow")
    // .attr("cx", 310)
    // .attr("cy", 35)
    // .attr("r", 25)
    // .attr("fill", "red")

    this.addListeners();
  }

  presentGraph(){
    this.graph.renderGraph();
    // this.graph.addListeners();
  }

  clearMine(){
    d3.select(".mineSvg").selectAll("*")
    // .filter(d => {
    //   return typeof d !== "undefined" && d.type !== "selector"
    // })
    .remove();
    this.blocks = [];
  }

  addRow(){
    if (this.mine.length < 4) {
      let index = this.numBlocks;
      let newRow = [];
      for (let i = 0; i <= this.mine[0].length; i++){
        newRow.push({profit: -1, idx: index});
        index++;
        this.numBlocks++;
      }
      this.mine.unshift(newRow);
      this.updateNodeLayers(this.mine);
      this.clearMine();
      this.drawMine();
      this.graph.clearGraph();
      this.graph.generateMatrixFromMine(this);
      this.graph.populateLinks();
      this.presentGraph();
    }
  }

  removeRow(){
    if (this.mine.length > 1){
      this.mine.shift();
      this.findNumBlocks();
      this.updateNodeLayers(this.mine);
      this.clearMine();
      this.drawMine();
      //
      this.graph.clearGraph();
      this.graph.generateMatrixFromMine(this);
      this.graph.populateLinks();
      this.presentGraph();
    }
  }

  findPadding(row){
    let topLength = 3 + this.mine.length - 1;
    let sum = 0;
    let rowCp = row;
    while (rowCp > 0){
      sum += topLength;
      topLength--;
      rowCp--;
    }
    return sum;
  }

  findBlockIndex(row,col){
    return col + this.findPadding(row);
  }

  reset(){
    this.mine = this.mineOptions[this.mineIndex];
    this.graph.solver.playback = false;
    this.currentProfit = 0;
    this.svg.selectAll(".profit").transition().duration(1).text(`Your Current Profit: $${this.currentProfit}k`);
    this.updateNodeLayers(this.mine);
    this.clearMine();
    this.drawMine();
    this.graph.clearGraph();
    this.graph.generateMatrixFromMine(this);
    this.graph.populateLinks();
    this.presentGraph();
  }

  rectify(row,col){
    return `rect:${row}-${col}`
  }

  findAboves(id){
    const result = [id];
    const splat = id.split(new RegExp('(:|-)'));
    const row = Number(splat[2]);
    const col = Number(splat[4]);
    //
    let count = 0;
    while (count < row){
      count++;
      for (let k = 0; k <= count; k++){
        result.push(this.rectify(row-count,k+col));
      }
    }
    return result;
  }

  clearGuess(){

    this.svg.selectAll("rect").style("stroke", d => {
      this.blocks[this.findBlockIndex(d.row,d.col)].border = "black";
      return "black"
    })
    const lastProfit = this.currentProfit;
    this.currentProfit = 0;
    this.graph.passProfit(-1 * lastProfit);
    this.svg.selectAll(".profit").transition().duration(1).text(`Your Current Profit: $${this.currentProfit}k`);
  }

  undoGuess(){
    if (this.guessStack.length > 0){
      const last = this.guessStack.pop();


      this.svg.selectAll("rect").filter(d => last.includes(`rect:${d.row}-${d.col}`))
      .style("stroke", d => {
        this.blocks[this.findBlockIndex(d.row,d.col)].border = "black";
        return "black"
      })
      const lastProfit = this.profitStack.pop();
      this.currentProfit = this.currentProfit - lastProfit;
      this.graph.passProfit(lastProfit);
      this.svg.selectAll(".profit").transition().duration(1).text(`Your Current Profit: $${this.currentProfit}k`)
    }
  }

  scramble(){
    this.clearGuess();
    this.mineIndex = (this.mineIndex + 1) % 3;
    this.mine = this.mineOptions[this.mineIndex];
    this.updateNodeLayers(this.mine);
    this.clearMine();
    this.drawMine();
    this.graph.clearGraph();
    this.graph.generateMatrixFromMine(this);
    this.graph.populateLinks();
    this.presentGraph();
  }

  addListeners(){
    const html = document.getElementById("body");

    document.getElementById("clear-guess").onclick = () => this.clearGuess();
    document.getElementById("undo-guess").onclick = () => this.undoGuess();
    // document.getElementById("remove-row").onclick = () => this.removeRow();
    document.getElementById("reset-graph-and-mine").onclick = () => this.reset();
    document.getElementById("scramble-blocks").onclick = () => this.scramble();

    // document.getElementById("select-guess").onclick = () => {
    //   // html.classList.toggle('active');
    //   this.guessing = true
    // };

    this.blocks.forEach(block => {
      if (block.profit !== null){
        let tmpBlock = document.getElementById(`rect:${block.row}-${block.col}`)


        // let tmpColor;
        tmpBlock.addEventListener("mouseover",(e) => {
          if (this.guessing){
            const aboves = this.findAboves(e.currentTarget.id)
            //
            this.svg.selectAll("rect").filter(function(d){
              return aboves.includes(`rect:${d.row}-${d.col}`);
            })
            .style("stroke", "#f442aa")
            .style("stroke-width", 2)
          }
        })
        //
        tmpBlock.addEventListener("mouseout",(e) => {
          if (this.guessing){
            const aboves = this.findAboves(e.currentTarget.id)
            this.svg.selectAll("rect").filter(function(d){
              return aboves.includes(`rect:${d.row}-${d.col}`);
            })
            .style("stroke", d => d.border)
            .style("stroke-width", 2)
          }
        })

        // this.guessing = false;
        // html.classList.toggle('active');
        tmpBlock.addEventListener("click", e => {
          if (this.guessing){
            const aboves = this.findAboves(e.currentTarget.id)
            const tmpArr = [];
            let tmpProfit = 0
            this.svg.selectAll("rect").filter((d) => {
              //
              if (aboves.includes(`rect:${d.row}-${d.col}`)){
                //
                if (d.border === "black") {
                  this.currentProfit = this.currentProfit + d.profit
                  tmpProfit = tmpProfit + d.profit;
                  tmpArr.push(`rect:${d.row}-${d.col}`)
                };
                return true;
              }else{
                return false;
              }
            })
            .style("stroke", d => {
              this.blocks[this.findBlockIndex(d.row,d.col)].border = "#f442aa";
              return "#f442aa"
            })
            .style("stroke-width", 2)

            this.guessStack.push(tmpArr);
            this.profitStack.push(tmpProfit);
            this.graph.passProfit(tmpProfit);
            this.svg.selectAll(".profit").transition().duration(1).text(`Your Current Profit: $${this.currentProfit}k`)
          }else{
            let updatableObj;
            this.svg.selectAll("rect").filter((d) => {
              //
              if (typeof d !== "undefined" && `rect:${d.row}-${d.col}` === e.currentTarget.id){
                // this.mine[d.row][d.col].color = this.currentBlockType.color;
                updatableObj = this.blocks.filter(block => (block.col === d.col && block.row === d.row))[0];
                updatableObj.profit = this.currentBlockType.profit;
                updatableObj.color = this.currentBlockType.color

                return true;
              }
            })
            .attr("fill",`url(#${this.currentBlockType.texture})`)
            // .style("stroke", "red")
            // .style("stroke-width", 2);

            //
            this.svg.selectAll(".blockLabel")
            .filter(d => {return (d.row === updatableObj.row && d.col === updatableObj.col)})
            .style("fill",d => {
              if (this.currentBlockType.profit > 0){
                return "green"
              }else{
                return "red"
              }
            })
            let indices = e.currentTarget.id.split(":")[1].split("-");
            //
            this.mine[Number(indices[0])][Number(indices[1])].profit = this.currentBlockType.profit;

            this.graph.clearGraph();
            this.graph.generateMatrixFromMine(this);
            this.graph.populateLinks();
            this.presentGraph();
          }


          //
          // this.svg.selectAll(".block").attr("fill","white");
        })
        //
      }
      })

      // this.blockSelectors.forEach(selector => {
      //   //
      //   let tmpSelector = document.getElementById(`circleSelector:${selector.id}`)
      //   tmpSelector.addEventListener("click", e => {
      //     if (this.guessing) {
      //       this.guessing = false;
      //       //
      //
      //       // html.classList.toggle('active');
      //     }
      //     this.svg.selectAll(".circleSelector")
      //     .style("stroke-width", "3")
      //     .style("stroke",(d) => {
      //       if (e.currentTarget.id.split(":")[1] === `${d.id}`){
      //         this.currentBlockType = d;
      //         //
      //         return "red";
      //       }else{
      //         //
      //         return "none";
      //       }
      //       //
      //     })
      //     //
      //   }
      // )}
    // )

    // let addRow = document.getElementById("addRow");
    // addRow.addEventListener("click", e => {
    //
    //   if (this.mine.length < 4) {
    //     let index = this.numBlocks;
    //     let newRow = [];
    //     for (let i = 0; i <= this.mine[0].length; i++){
    //       newRow.push({profit: -1, idx: index});
    //       index++;
    //       this.numBlocks++;
    //     }
    //     this.mine.unshift(newRow);
    //     this.updateNodeLayers(this.mine);
    //     this.clearMine();
    //
    //     this.drawMine();
    //     this.graph.clearGraph();
    //     this.graph.generateMatrixFromMine(this);
    //     this.graph.populateLinks();
    //     this.presentGraph();
    //   }
    // })
    //
    // let removeRow = document.getElementById("removeRow");
    // removeRow.addEventListener("click", e =>{
    //
    //   if (this.mine.length > 1){
    //     this.mine.shift();
    //     this.findNumBlocks();
    //     this.updateNodeLayers(this.mine);
    //     this.clearMine();
    //     this.drawMine();
    //
    //     this.graph.clearGraph();
    //     this.graph.generateMatrixFromMine(this);
    //     this.graph.populateLinks();
    //     this.presentGraph();
    //   }
    // })

  }
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
  constructor(stepping, playback, count, matrix, parent, max_flow, svgGraph, mineSvg, mine, currentProfit){
    // 
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
      
      return this.findIndexFromRowCol(d.row,d.col) === block
    })
    .transition()
    .duration(1000)
    .style("stroke","none")
    .attr("fill","none")

    this.mineSvg.selectAll("text")
    .filter(d => {
      
      return this.findIndexFromRowCol(d.row,d.col) === block
    })
    .transition()
    .duration(1000)
    .style("fill","none")


  }

  BFS(graph, s, t, parent){
    // 
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
    let sink = this.findIndexFromRowCol(0,this.mine[0].length-1)+1;
    let parent = this.parent;
    if (this.BFS(graph, source, sink, parent).pathToSink){
      let path_flow = 91;
      let s = sink;
      let path = [s];
      while (s != source){
        // 
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
          // 
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
        
        this.mineSvg.selectAll(".maxProfit").transition().duration(1000)
        .attr("transform", d => {
          return `translate(${120}, ${45})`
        })
      }, 1000)

      setTimeout(() => {
        
        this.mineSvg.selectAll(".profitSummary").transition().duration(1000)
        .attr("transform", d => {
          return `translate(${120}, ${70})`
        })
      }, 2000)


      this.highlightSolution(solution,0,solutionEdges);
      // 
    }
    // 
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
        // 
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
      // 
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
        .style("stroke-width", d => {
          return (d.capacity > 5 ? 4 : 8);
        })

        this.mineSvg.selectAll("rect").filter((d) => {
          if (type === "search"){
            if (this.findIndexFromRowCol(d.row,d.col) === path[i+1]){
              
              return true;
            }
          }else{
            
            if (this.findIndexFromRowCol(d.row,d.col) === path[i]){
              
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
          
          return this.findIndexFromRowCol(d.row,d.col) === path[i+1]
        })
        .transition()
        .duration(this.animationInterval)
        .attr("fill", (d)=>{
          
          return `url(#${this.colorMap[d.color]})`;
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