class Mine {
  constructor(){
    this.mine = [[-1,-1,-1,-1,-1],[null,1,1,1,null]];
    this.block;
    this.svg = d3.select("body").append("svg").attr("width", 700).attr("height", 700)
    this.blocks = [];
    this.five = 5;
    this.blockSelectors = [{id: 0, color: "#FFD700", profit: 1}, {id: 1, color: "#8B4513", profit: -1}];
    this.currentBlockType;
    this.drawMine();
    this.addListeners();
  }

  drawMine(){
    // console.log(5);
    this.mine.forEach((row,i) => {
      row.forEach((profit,j) => {
        let color;
        if (profit === null){
          color = "black";
        }else{
          color = this.blockSelectors.filter(obj => {
            return obj.profit === profit
          })[0].color
        }
        debugger
        this.blocks.push({profit, row: i, col: j, color})
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
      debugger
      return d.color
    })

    // this.svg.selectAll(".circleSelector").append("circle")
    // .attr("class","circle-selector")
    // .attr("r",20)
    // .attr("x",300)
    // .attr("y",100)
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
          debugger
          this.svg.selectAll("rect").filter(function(d){
            debugger
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
              debugger
              return "red";
            }else{
              // debugger
              return "none";
            }
            // debugger
          })
          debugger
        }
    )}
  )}
}

export default Mine;
