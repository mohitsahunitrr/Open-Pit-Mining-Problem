const Vertex = (x,y,r) => {
  this.x = x,
  this.y = y,
  this.r = r,
}

Circle.prototype.render = (ctx) => {
  ctx.beginPath();
  ctx.arc(100,100,100,0,2*Math.PI);
  ctx.strokeStyle = "purple";
  ctx.inedWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fill();
}

module.export = Vertex;
