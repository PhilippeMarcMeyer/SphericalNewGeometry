/*
	Inspired by terrain demo https://codepen.io/Spongman/pen/rJOoJa/
*/

var renderer;
var geometry;
var definition = 32;
var radiusX =150;
var radiusY=150;
var radiusZ=150;
  var gId = 123;
function setup() {
  
  // we need to remember the renderer that is created so
  // we can call some of its internal methods later
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();


  camera(0, -400, 300, 0, 0, 0, 0, -1, 0);


    var ellipsoid = function() {
      for (var i = 0; i <= definition; i++) {
        var v = i / definition;
        var phi = Math.PI * v - Math.PI / 2;
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);

        for (var j = 0; j <= definition; j++) {
          var u = j / definition;
          var theta = 2 * Math.PI * u;
          var cosTheta = Math.cos(theta);
          var sinTheta = Math.sin(theta);
          var p = new p5.Vector(cosPhi * sinTheta, sinPhi, cosPhi * cosTheta);
          this.vertices.push(p);
          this.vertexNormals.push(p);
          this.uvs.push(u, v);
        }
      }
    };
	
    geometry = new p5.Geometry(definition, definition, ellipsoid);


}

function draw() {
  var tt = millis();

  background(0);
  
//ambientLight(10,10,24);
  // calculate the sun & moon's positions from spherical angles
  var sunPos = p5.Vector.fromAngles(tt / 5000, PI / 4, 420);
  var moonPos = p5.Vector.fromAngles(PI + tt / 5000, PI / 4, 1000);
  


  fill(62,89,250);
   ambientLight(10);
 // ambientMaterial(10,10,240)
  // add the sun & moon lights
  pointLight(255, 250, 136, sunPos);
   pointLight(255, 250, 136, sunPos);
      pointLight(255, 250, 136, sunPos);

  pointLight(150, 150, 150, moonPos);

  // re-compute the faces 
  geometry.computeFaces()._makeTriangleEdges()._edgesToVertices();
  
  geometry.faces.forEach(function(x){
	  x.color = color(random(250),random(250),random(250));
  });
  
  // update the webgl buffers
  renderer.createBuffers(gId, geometry);
  
  // render the geometry
  renderer.drawBuffersScaled(gId, radiusX, radiusY, radiusZ);
    // add spheres where the lights are going to be
  push();
  fill(245, 231, 46);
  translate(sunPos);
  sphere(40,24,24);
  pop();

  push();
  translate(moonPos);
  fill(255);
  sphere(40,24,24);
  pop();

  
}
