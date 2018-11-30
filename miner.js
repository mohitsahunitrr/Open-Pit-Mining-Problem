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
    ctx.strokeStyle = "purple";
    ctx.inedWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  const Edge = function(v1, v2){
    this.v1 = v1;
    this.v2 = v2;
  }

  Edge.prototype.render = function(ctx){
    const height = 10;
    ctx.fillStyle = "purple";
    const xCoord = this.v1.x;
    const yCoord = this.v1.y - (height/2);
    const width = this.v2.x - this.v1.x - this.v2.r - 20;
    ctx.fillRect(xCoord, yCoord, width, height);
  }

  const EdgeArrow = function(v1,v2){

  }

  const v1 = new Vertex(100,100,20);
  const v2 = new Vertex(300,100,20);
  const e1 = new Edge(v1,v2);

  e1.render(ctx);
  v1.render(ctx);
  v2.render(ctx);



});
