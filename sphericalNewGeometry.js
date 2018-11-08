/*
	Inspired by terrain demo https://codepen.io/Spongman/pen/rJOoJa/
*/
var sunLightPos;
var renderer;
var font;
var fontSize = 14;
var geometry;
var definition = 36;
var radiusX = 200;
var radiusY = 200;
var radiusZ = 200;
var gId = 123;
var camX,camY;
var earth;
var once = false;
var usePrimitive = false;
var earthLoaded = false;
var places = [
	{"name":"Paris","lat":48.856614,"lon": 2.3522219}
]

function setup() {
  font = loadFont("fonts/Roboto-Regular.otf");
  renderer = createCanvas(windowWidth, windowHeight-120, WEBGL);
  sunLightPos = createVector(600, 0, -600);
  noStroke();
  	camY = -600;
	camX = 0;
	
	camera(camX, camY, 200, 0, 0, 0, 0,1, 0);
	var delta;
	renderer.mouseWheel(function(e){
	var way = (e.deltaY > 0) ? 1 : -1;
	camY += e.deltaY;
	if(camY > -200) camY = -200;
	if(camY < -4000) camY = -4000;

	camera(camX, camY, 200, 0, 0, 0, 0,1, 0);
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
	
	if(!usePrimitive) geometry = new p5.Geometry(definition, definition, ellipsoid);
	

    loadImage("images/earth2.jpg", function(temp) {
		earth = temp.get();
		if(earth){
			earthLoaded = true;
		}
		
	}, function(event) {
		console.log(event);
	});
	


}

function draw() {
	orbitControl();
	background(0);
	if(earthLoaded){
		var currentRotY = frameCount * 0.003;
		background(0);
		push();
		fill(62,89,250);
		if(!once){
		   rotateX(radians(90)); 
		}
		texture(earth);
		ambientLight(90);
		directionalLight(255, 250, 136, sunLightPos.x,sunLightPos.y,sunLightPos.z);

		rotateX(radians(330)); 
		rotateY(radians(180)+currentRotY);
		//rotateZ(radians(10)); // real inclination is around 22°

		if(!usePrimitive)  {
			geometry.computeFaces()._makeTriangleEdges()._edgesToVertices();
			renderer.createBuffers(gId, geometry);
			renderer.drawBuffersScaled(gId, radiusX, radiusY,radiusZ);
		}else{
			sphere(radiusX,24,24);
		}
//rotateY(radians(180)); 
		places.forEach(function(place){
			// fix: in OpenGL, y & z axes are flipped from math notation of spherical coordinates

			var theta = radians(place.lat) + PI/2 -0.12;
			var phi = radians(place.lon) - PI/2 -0.01;
			var r = radiusX;
			/*
			var x = r * sin(theta) * cos(phi);
			var y = -r * sin(theta) * sin(phi);
			var z = r * cos(theta);
			*/
			var x = r * cos(theta) * cos(phi);
			var y = -r * sin(theta);
			var z = -r * cos(theta) * sin(phi);
			
			fill("red")

			stroke("red")
			strokeWeight(6);
			point(x,y,z);
			if(font && false){
			strokeWeight(1);
			 points = font.textToPoints(place.name, 0, 0, fontSize, {
				sampleFactor: 5,
				simplifyThreshold: 0
			});
			
			points.forEach(function(pti,i){
				point(x + pti.x, y + pti.y,z);
			});
			}
			//translate(x,y,z);
			//box(20);
		});

	pop();
		
		
	}
}
