import Graph from "./graph.js";

class Mine {
  constructor(){
    this.mine = [
      [
        {profit: -1, idx: 3},
        {profit: -1, idx: 4},
        {profit: -1, idx: 5},
        {profit: -1, idx: 6},
        {profit: -1, idx: 7}
      ],
      [
        {profit: null, idx: null},
        {profit: 1, idx: 0},
        {profit: 1, idx: 1},
        {profit: 1, idx: 2},
        {profit: null, idx: null}
      ]
    ];
    this.nodeLayers;
    this.updateNodeLayers(this.mine.reverse());
    this.numBlocks = 8;
    this.block;
    this.svg = d3.select("body").append("svg").attr("width", 700).attr("height", 400)
    this.blocks = [];
    this.blockSelectors = [{id: 0, color: "#FFD700", profit: 1}, {id: 1, color: "#8B4513", profit: -1}];
    this.currentBlockType;
    this.drawMine();
    this.addListeners();
    this.graph = new Graph();
    this.graph.generateMatrixFromMine(this);
    this.graph.populateLinks(this.mine);
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
      debugger
    })
    this.nodeLayers = result;
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

export default Mine;
