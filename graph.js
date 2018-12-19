import Solver from "./solver.js";

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
    this.solver = new Solver(this.stepping, this.playback, this.count, this.matrix, this.parent, this.max_flow, this.svgGraph, this.mineSvg, this.mine, this.currentProfit);
  }

  addListeners(){
    // document.getElementById("step-animation").onclick = () => this.addRow();
    // document.getElementById("play-animation").onclick = () => this.removeRow();
    // document.getElementById("stop-animation").onclick = () => this.reset();
  }
}

export default Graph;
