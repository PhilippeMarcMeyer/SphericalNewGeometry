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
  var camX,camY;
function setup() {
  
  // we need to remember the renderer that is created so
  // we can call some of its internal methods later
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();


  	camY = -600;
	camX = 0;
	camera(camX, camY, 200, 0, 0, 0, 0,1, 0);
		var delta;
	renderer.mouseWheel(function(e){
	var way = (e.deltaY > 0) ? 1 : -1;
	if(way == 1){
		delta = abs(camY) / 40 ;
	}else{
		delta = abs(camY) / 10;
	}
	if (delta > 1){
		camY += way * delta ;
	}else{
		if(way == -1){
			camY -= 1 ;
		}

	}

	camera(camX, camY, 200, 0, 0, 0, 0,-1, 0);

  });


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
  var sunPos = p5.Vector.fromAngles(tt / 7000, PI / 4, radiusX*2);
  var moonPos = p5.Vector.fromAngles(PI + tt / 5000, PI / 2, radiusX*1.5);
  

  push();
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
  		 // this.colors.push(color(random(250),random(250),random(250)));


  //normalMaterial();
  // update the webgl buffers
  renderer.createBuffers(gId, geometry);
  rotateX(frameCount * 0.003);
   rotateY(frameCount * 0.001);

  // render the geometry
  renderer.drawBuffersScaled(gId, radiusX, radiusY, radiusZ);
    // add spheres where the lights are going to be
	  pop();

  push();
  fill(245, 231, 46);
  translate(sunPos);
  sphere(10);
  pop();

  push();
  translate(moonPos);
  fill(255);
  sphere(10);
  pop();
  /*
    push();
	fill("white");
  stroke("white");
var arr = geometry.faces[0]
var ptA = geometry.vertices[arr[0]].copy().mult(radiusX);
var ptB = geometry.vertices[arr[1]].copy().mult(radiusX);
var ptC = geometry.vertices[arr[2]].copy().mult(radiusX);
  rotateX(frameCount * 0.003);
   rotateY(frameCount * 0.001);
line(ptA.x, ptA.y, ptA.z,ptB.x, ptB.y, ptB.z);
line(ptB.x, ptB.y, ptB.z,ptC.x, ptC.y, ptC.z);
line(ptC.x, ptC.y, ptC.z,ptA.x, ptA.y, ptA.z);
noStroke();
  pop();
  */
}
