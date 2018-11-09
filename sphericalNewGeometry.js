/*
	Inspired by terrain demo https://codepen.io/Spongman/pen/rJOoJa/
*/
var sunLightPos;
var renderer;
var fontPtr = null;
var fontSize = 12;
var currentRotY =0;
var geometry;
var definition = 26;
var selectedOrientation = "europe";
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
	{"name":"Paris","lat":48.5,"lon": 2.2,"offScreen":null,"alt":30,"pop":2.2},
	{"name":"London","lat":51,"lon": -1,"offScreen":null,"w":50,"pop":8.136,"deltax":-20},
	{"name":"New York","lat":40.4,"lon": -74,"offScreen":null,"pop":8.623},
	{"name":"Madrid","lat":40.2,"lon": -3.4,"offScreen":null,"alt":30,"deltax":-15},
	{"name":"Casablanca","lat":33.3,"lon": -7.3,"offScreen":null,"alt":30,"deltax":-40,"pop":3.6},
	{"name":"Berlin","lat":52.3,"lon":13.2,"offScreen":null,"alt":40,"pop":3.575},
	{"name":"Moscow","lat":55,"lon":37,"offScreen":null,"alt":40,"pop":11.92,"w":54},
	{"name":"Sydney","lat":90+33.5,"lon":151.1,"offScreen":null,"alt":-40,"pop":5.137,"w":54},
	{"name":"tokyo","lat":36,"lon":140,"offScreen":null,"alt":40,"pop":9.273},
];


function preload() {
	fontPtr = loadFont("fonts/Roboto-Regular.otf");
	while(fontPtr==null){

	}
	preparePlaces();
	placesDone = true;
	
}


function setup() {
	setUI();
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


function setUI(){
	var dict = {
		"europe":"Europe",
		"africa":"Africa",
		"north-america":"North America",
		"south-america":"South America",
		"asia":"Asia",
		"australia":"Australia",
		"japan-sea":"Japan Sea",
		"north-pole":"North Pole",
		"south-pole":"South Pole",
	};
	makeSelect("positionChoice",dict,selectedOrientation,function(){
		selectedOrientation = this.value;
		once = false;
		 currentRotY = 0;
	});
	
	setBtnName();
	 $("#stopAndGo").on("click",function(){
		toggleRotation()
	});
}

function toggleRotation(){
	autoRotate = !autoRotate;
	setBtnName();
}

function setBtnName(){
	if(autoRotate){
		$("#stopAndGo").html("Stop !");
	}else{
		$("#stopAndGo").html("Rotate !");
	}
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
			if(selectedOrientation == "europe"){
				lastOrbitCtrlRotations.x = radians(45);			 
				lastOrbitCtrlRotations.y = radians(180);		 
			}else if(selectedOrientation == "africa"){
				lastOrbitCtrlRotations.x = radians(70);			 
				lastOrbitCtrlRotations.y = radians(180);
			}else if(selectedOrientation == "north-america"){
				lastOrbitCtrlRotations.x = radians(45);			 
				lastOrbitCtrlRotations.y = radians(280);
			}else if(selectedOrientation == "south-america"){
				lastOrbitCtrlRotations.x = radians(90);			 
				lastOrbitCtrlRotations.y = radians(240);
			}else if(selectedOrientation == "asia"){
				lastOrbitCtrlRotations.x = radians(55);			 
				lastOrbitCtrlRotations.y = radians(90);
			}else if(selectedOrientation == "australia"){
				lastOrbitCtrlRotations.x = radians(90);			 
				lastOrbitCtrlRotations.y = radians(45);
			}else if(selectedOrientation == "japan-sea"){
				lastOrbitCtrlRotations.x = radians(45);			 
				lastOrbitCtrlRotations.y = radians(40);
			}else if(selectedOrientation == "north-pole"){
				lastOrbitCtrlRotations.x = radians(0);			 
				lastOrbitCtrlRotations.y = radians(0);
			}else if(selectedOrientation == "south-pole"){
				lastOrbitCtrlRotations.x = radians(180);			 
				lastOrbitCtrlRotations.y = radians(0);
			}
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
	/*
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
	*/
	renderer.doubleClicked(function() {
		toggleRotation();
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
		var w = place.w || fontSize * place.name.length * 0.6;
	    var h = fontSize + 4;
		place.offScreen =  createGraphics(w, h);
		place.offScreen.background(255);
		place.offScreen.stroke("red");
		place.offScreen.noFill();
		place.offScreen.rect(0,0,w-1, h-1);
		place.offScreen.textSize(fontSize);
		place.offScreen.stroke("black");
		place.offScreen.fill("black");
		place.offScreen.noFill();
		place.offScreen.text(place.name,4,fontSize);
		//place.offScreen.scale(-1,1);
		//place.offScreen.image(place.offScreen, -place.offScreen.width, 0);
	});
}

function drawPlaces(){
	var yRot = (autoRotate) ? currentRotY : 0;
	places.forEach(function(place){
		// fix: in OpenGL, y & z axes are flipped from math notation of spherical coordinates
		var theta = 0;
		if(place.lat < 90){
			theta = radians(abs(90-place.lat)) + PI/2 
		}else{
			theta = radians(place.lat) + PI/2 ;//-0.12
		}
		var phi = radians(place.lon) - PI/2 ;//-0.01
		var r = radiusX;

		var x = r * cos(theta) * cos(phi);
		var y = -r * sin(theta);
		var z = -r * cos(theta) * sin(phi);
		
		push();
		var size = round(place.pop || 3);
			rotateX(lastOrbitCtrlRotations.x); 
			rotateY(lastOrbitCtrlRotations.y+yRot); 
			translate(x,y,z);
			fill("red");
			sphere(size);
		pop();

		push();
		var altitude = place.alt || 50;
		var deltax = place.deltax || 0;
			rotateX(lastOrbitCtrlRotations.x); 
			rotateY(lastOrbitCtrlRotations.y+yRot); 
			
			translate(x-deltax,y-altitude,z);
			stroke("red");
			var lineDelta = place.lat >= 90 ? -7 : +7;
			line(0,lineDelta,0,deltax,altitude,0);
			rotateY(-lastOrbitCtrlRotations.y-yRot); //
			texture(place.offScreen);
			plane(place.offScreen.width,place.offScreen.height);
		pop();
	});
}


function makeSelect(id,dictionary,selectedKey,onSelect){
	var ptr = document.getElementById(id);
	if(ptr){
		for (var key in dictionary) {
			var anOption = document.createElement("option");
			anOption.value = key;
			anOption.text = dictionary[key];
			if(selectedKey == key){
				anOption.selected = true;
			}
			ptr.appendChild(anOption);
		}
	}
	if(onSelect){
		ptr.onchange = onSelect;
	}
}