/*
	Inspired by terrain demo https://codepen.io/Spongman/pen/rJOoJa/
*/
var sunLightPos;
var renderer;
var fontPtr = null;
var fontSize = 14;
var currentRotY =0;
var geometry;
var definition = 26;
var radiusX = 200;
var radiusY = 200;
var radiusZ = 200;
var gId = 123;
var camX,camY;
var earth;
var once = false;
var usePrimitive = false;
var earthLoaded = false;
var orbiter = null;
var autoRotate = true;
var lastOrbitCtrlRotations;
var fr = 8;
var placesDone = false;
var places = [
	{"name":"Paris","lat":48.856614,"lon": 2.3522219,"offScreen":null},
	{"name":"London","lat":51.5085300,"lon": -0.1257400,"offScreen":null},
	{"name":"New York","lat":40.712784,"lon": -74.005941,"offScreen":null}

];


function preload() {
	fontPtr = loadFont("fonts/Roboto-Regular.otf");
	while(fontPtr==null){

	}
	preparePlaces();
	placesDone = true;
	
}


function setup() {
	
	renderer = createCanvas(windowWidth, windowHeight-120, WEBGL);
	lastOrbitCtrlRotations = createVector(0, 0, 0);

	radiusX = radiusY = radiusZ = min(windowHeight,windowWidth) / 4; 

	frameRate(fr);
	sunLightPos = createVector(600, 0, -600);
	noStroke();

	setCamera();
	setListeners();

	if(!usePrimitive) {
		geometry = new p5.Geometry(definition, definition, makeEllipsoid);
	}

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

	orbiter = orbitControl();
	background(0);
	if(earthLoaded){
		currentRotY+=0.005;
		var yRot = (autoRotate) ? currentRotY : 0;
		background(0);
		push();
		fill(62,89,250);
		if(!once){
		  lastOrbitCtrlRotations.y = radians(180);
		  lastOrbitCtrlRotations.x = radians(60);
		}
		texture(earth);
		ambientLight(210);
		directionalLight(255, 250, 136, sunLightPos.x,sunLightPos.y,sunLightPos.z);
		
		rotateX(lastOrbitCtrlRotations.x); 
		rotateY(lastOrbitCtrlRotations.y+yRot); 

		//rotateZ(radians(10)); // real inclination is around 22°

		if(!usePrimitive)  {
			geometry.computeFaces()._makeTriangleEdges()._edgesToVertices();
			renderer.createBuffers(gId, geometry);
			renderer.drawBuffersScaled(gId, radiusX, radiusY,radiusZ);
		}else{
			sphere(radiusX,24,24);
		}
		
		pop();
		
		if(placesDone){
			drawPlaces();
		}
	}
}

function setCamera(){
	camY = -600;
	camX = 0;
	camera(camX, camY, 200, 0, 0, 0, 0,1, 0);
}

function setListeners(){
	renderer.mouseOver(function(){
		cursor(HAND);
	});
	renderer.mousePressed(function(){
	// reproduce orbitControl rotations (trying!)
		currentRotY=0;
		lastOrbitCtrlRotations.x = (mouseX - width / 2) / (width / 2);
		lastOrbitCtrlRotations.y = (mouseY - height / 2) / (height / 2);
	});

	renderer.mouseReleased(function(){
		cursor(ARROW);
		currentRotY=0;
		lastOrbitCtrlRotations.x = (mouseX - width / 2) / (width / 2);
		lastOrbitCtrlRotations.y = (mouseY - height / 2) / (height / 2);
	});
	
	renderer.doubleClicked(function() {
		autoRotate = !autoRotate;
	});
	
	renderer.mouseWheel(function(e){
		var way = (e.deltaY > 0) ? 1 : -1;
		camY += e.deltaY;
		if(camY > -200) camY = -200;
		if(camY < -4000) camY = -4000;
		camera(camX, camY, 200, 0, 0, 0, 0,1, 0);
  });

}

window.onresize = function(){
 radiusX = radiusY = radiusZ = min((windowHeight-120),windowWidth) /3; 
 resizeCanvas(windowWidth,windowHeight-120);
 translate(0,0,0);
 once=false;
 setCamera()
};

function makeEllipsoid(){
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
}

function preparePlaces(){
	//{"name":"Paris","lat":48.856614,"lon": 2.3522219}
	places.forEach(function(place){
		var w = fontSize * place.name.length * 0.6;
	    var h = fontSize + 4;
		place.offScreen =  createGraphics(w, h);
		place.offScreen.background(255);
		place.offScreen.stroke("red");
		place.offScreen.noFill();
		place.offScreen.rect(0,0,w-1, h-1);
		place.offScreen.textSize(fontSize);
		place.offScreen.fill("red");

		place.offScreen.text(place.name,4,fontSize);
		place.offScreen.scale(-1,1);
		place.offScreen.image(place.offScreen, -place.offScreen.width, 0);
	});
}

function drawPlaces(){
	places.forEach(function(place){
		// fix: in OpenGL, y & z axes are flipped from math notation of spherical coordinates
		var theta = radians(place.lat) + PI/2 -0.12;
		var phi = radians(place.lon) - PI/2 -0.01;
		var r = radiusX;

		var x = r * cos(theta) * cos(phi);
		var y = -r * sin(theta);
		var z = -r * cos(theta) * sin(phi);
		
	push();
		rotateX(lastOrbitCtrlRotations.x); 
		rotateY(lastOrbitCtrlRotations.y+currentRotY); 
		translate(x,y-50,z);
 
		texture(place.offScreen);
		plane(place.offScreen.width,place.offScreen.height);
		pop();
	});
}
