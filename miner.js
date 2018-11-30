// const Vertex = require("./vertex.js");
// const Vertex = require("./vertex.js");

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const Vertex = function(x,y,r){
    this.x = x,
    this.y = y,
    this.r = r
  }

  Vertex.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    // ctx.strokeStyle = "purple";
    // ctx.inedWidth = 1;
    // ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  const Edge = function(v1, v2){
    this.v1 = v1;
    this.v2 = v2;
  }

  Edge.prototype.render = function(ctx){
    ctx.beginPath();
    ctx.moveTo(this.v1.x,this.v1.y);
    ctx.lineTo(this.v2.x,this.v2.y);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "purple";
    ctx.stroke();
  }

  const EdgeArrow = function(v1,v2){

  }

  const vertices = [
    new Vertex(300,300,20),
    new Vertex(500,300,20),

    new Vertex(100,100,20),
    new Vertex(300,100,20),
    new Vertex(500,100,20),
    new Vertex(700,100,20)
  ]

  const edges = [
    new Edge(vertices[4],vertices[0]),
    new Edge(vertices[4],vertices[1]),
    new Edge(vertices[4],vertices[2]),
    new Edge(vertices[5],vertices[1]),
    new Edge(vertices[5],vertices[2]),
    new Edge(vertices[5],vertices[3])
  ]

  vertices.forEach((vertex) => {
    vertex.render(ctx);
  })

  // v1.render(ctx);
  // v2.render(ctx);
  // v3.render(ctx);
  // v4.render(ctx);
  // v5.render(ctx);
  // v6.render(ctx);




});
