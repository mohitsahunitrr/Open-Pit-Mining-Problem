class Graph {
  constructor(){
    this.matrix = [];
    this.mine;
    this.mineH;
    this.mineW;
    this.infCapacity = 1000000;
    this.svgWidth = 700;
    this.svgHeight = 900;
    this.svgGraph = d3.select("body").append("svg").attr("width", this.svgWidth).attr("height", this.svgHeight);
    this.nodes = [];
    this.links = [];
    this.node;
    this.edgepaths;
    this.edgelabels;
    this.link;
    this.restrictions = [];
    this.nodeLabelList = "abcdefghijklmnopqruvwxyz"
    this.innerNodeCount;
    this.force;
    // debugger
  }

  populateMatrix(size){
    for (let row = 0; row < size; row++){
      let newRow = []
      for (let col = 0; col < size; col++){
        newRow.push(0)
      }
      this.matrix.push(newRow);
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
    // debugger
    this.mine = mineObj.mine;
    const matrixSize = mineObj.numBlocks + 2;
    this.populateMatrix(matrixSize);
    this.innerNodeCount = matrixSize-1;
    let nodeLayers = mineObj.nodeLayers;
    // this.mineH = mine.length;
    // this.mineW = mine[0].length;
    this.mine.forEach((row,i) => {
      row.reverse().forEach((el, j) => {
        debugger
        if (el.profit !== null){
          this.innerNodeCount--;
          let newPos = this.findNodeNum(i,j,this.mine);
          if (el.profit > 0) this.matrix[0][newPos] = el.profit;
          else if (el.profit < 0) this.matrix[newPos][this.matrix.length - 1] = (-1*el.profit);
          let aboves = this.findBlocksAbove(i,j,this.mine);
          // debugger
          aboves.forEach(pos => {
            el;
            mineObj;
            // debugger
            let infCol = this.findNodeNum(i,j,this.mine);
            let infRow = this.findNodeNum(pos[0],pos[1],this.mine);
            this.matrix[infRow][infCol] = this.infCapacity;
          })
          // debugger
          i;
          // nodeLayers;
          // debugger
          if (nodeLayers[i][0] === el.idx){
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: this.svgWidth/6, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          }else if (nodeLayers[i][1] === el.idx){
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit, fixed: true, x: 5*this.svgWidth/6, y: 100 + ((this.svgHeight-200)/(nodeLayers.length + 1)*(i+1))});
          }else{
            this.nodes.unshift({label: this.nodeLabelList[this.innerNodeCount-1], index: this.innerNodeCount, profit: el.profit});
          }
        }
      })
    })
    this.nodes.unshift({label: "s", index: 0, profit: null, fixed: true, x: this.svgWidth/2, y: this.svgHeight-100});
    this.nodes.push({label: "t", index: this.innerNodeCount+1, profit: null, fixed: true, x: this.svgWidth/2, y: 100});
    debugger

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

  renderGraph(){
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
      this.link.attr('x1', function(d) {
        debugger
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
    .linkDistance(100)
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

  }



}

export default Graph;
