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
    ctx.fillStyle = "red";
    ctx.fill();
  }

  const test = new Vertex(300,300,20);
  test.render();

});
