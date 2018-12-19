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

export default Graph;
