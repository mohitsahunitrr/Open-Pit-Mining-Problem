import Graph from "./graph.js";

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
    this.svg = d3.select(".svgMineBody").append("svg").attr("class","mineSvg").attr("width", 700).attr("height", window.innerHeight-450)
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
    this.graph = new Graph(this.svg);
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

export default Mine;
