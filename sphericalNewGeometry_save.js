/*
	Inspired by terrain demo https://codepen.io/Spongman/pen/rJOoJa/
*/
var sunPos;
var sunLightPos;
var sunGeometry;
var renderer;
var geometry;
var land;
var definition = 36;
var radiusX =150;
var radiusY=150;
var radiusZ=150;
var landRadius = 25;
var gId = 123;
var gLandId = 124;
var camX,camY;
var baseColors=[];
var facesStages = [];
var stagesNr = 0;
var opacity = 100;
var cameraPtr;
var earth;
var usePrimitive = true;
var earthLoaded = false;
var land = {
	landImage : null,
	colors : [],
	loaded : false,
	w :0,
	h:0,
	index : []
}

var experiment = [];

function setup() {
  
  // we need to remember the renderer that is created so
  // we can call some of its internal methods later
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);
  sunPos = createVector(-100, 100, -200);
  sunLightPos = createVector(-100, 100, -200);

  noStroke();
baseColors=[
	color(50,50,200,opacity),
	color(70,65,50,opacity),
	color(70,90,50,opacity),
	color(75,95,55,opacity),
	color(80,100,60,opacity),
	color(75,100,75,opacity),
	color(60,102,102,opacity),
	color(60,102,110,opacity),
	color(60,102,115,opacity),
	color(150,150,150,opacity),
	color(200,200,200,opacity),
	color(250,250,250,opacity)

];
stagesNr = baseColors.length;
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
	
	
    geometry = new p5.Geometry(definition, definition, ellipsoid);
	sunGeometry = new p5.Geometry(36, 36, ellipsoid);
	
	/*
	  var fullPath = "images/land50.jpg";
    loadImage(fullPath, function(temp) {
		land.image = temp.get();
		if(land.image){
			land.image.loadPixels();
			for (let i = 0; i < land.image.pixels.length-3; i+=4) {
			  let iColor = color(land.image.pixels[i],land.image.pixels[i+1],land.image.pixels[i+2],opacity);
			  land.colors.push(iColor);
			  land.index.push(lightness(iColor));
			}
			land.w = land.image.width;
			land.h = land.image.height;
			land.loaded = true;
		}
		
	}, function(event) {
		console.log(event);
	});
	*/
    loadImage("images/earth.jpg", function(temp) {
		earth = temp.get();
		if(earth){
			earthLoaded = true;
		}
		
	}, function(event) {
		console.log(event);
	});
	
	var def = (definition-1) * (definition-1);
	for(var i = 0; i < 33;i++){
		experiment.push(round(map(random(),0,1,0,150)));
	}
	/*
	land = new p5.Geometry(10, 10, function() {
    for (var y = 0; y <= this.detailY; y++) {
      var v = 0.05 + y / this.detailY;
      for (var x = 0; x <= this.detailX; x++) {
        var u = x / this.detailX;
        var p = new p5.Vector(u - 0.5, v - 0.5, 1);
        this.vertices.push(p);
        this.uvs.push(u, v);
      }
    }
  });
*/

}


function draw() {
  var tt = millis();
  var currentRotX = frameCount * 0.003;
  var currentRotY = frameCount * 0.001;

  background(0);
  
//ambientLight(10,10,24);
  // calculate the sun & moon's positions from spherical angles
  var moonPos = p5.Vector.fromAngles(PI + tt / 5000, PI / 2, radiusX*1.5);
 directionalLight(255, 250, 136, sunLightPos);
  push();
  if(earthLoaded)
		texture(earth);
  fill(62,89,250);
  // ambientLight(120);
  // add the sun & moon lights
 
  //directionalLight(150, 150, 150, moonPos);

  // re-compute the faces 
  geometry.computeFaces()._makeTriangleEdges()._edgesToVertices();

  // update the webgl buffers
  renderer.createBuffers(gId, geometry);
  rotateX(currentRotX);
  rotateY(currentRotY);


  renderer.drawBuffersScaled(gId, radiusX, radiusY,radiusZ);



 fill(255);
  stroke(255);
/*
for(var i = 1;i< experiment.length;i++){
	var pt1 = geometry.vertices[experiment[i-1]];
	var pt2 = geometry.vertices[experiment[i]];
	line(pt1.x,pt1.y,pt1.z,pt2.x,pt2.y,pt2.z);
}
*/
 
   if(land.loaded && false){
	 var pt1 = geometry.vertices[0];
	 
strokeWeight(9);
var w2 = floor(land.w / 2);
var h2 = floor(land.h / 2);

	land.colors.forEach(function(c,i){
		if(land.index[i] >= 10 && i%4==0){
			var pti = pt1.copy();
			var x = i % land.w;
			var y = floor(i / land.w);
			pti = doRotate(pti,0.01*(x-w2),0.01*(y-h2),0.01*(x-w2));
				stroke(c)
			point(pti.x,pti.y,pti.z);
		}
	});
 }
 //line(pt1.x,pt1.y,pt1.z,pt2.x,pt2.y,pt2.z);
 noStroke();
 //normalMaterial();
  // re-compute the faces & normals
  

    // add spheres where the lights are going to be
  pop();
  



  push();
  fill(245, 231, 46);
   translate(sunPos);
   sunGeometry.computeFaces()._makeTriangleEdges()._edgesToVertices();
   renderer.createBuffers("sunId", sunGeometry);
   renderer.drawBuffersScaled("sunId", 36, 36,36);
 
 //sphere(50);
  pop();

  push();
  translate(moonPos);
  fill(255);
  sphere(10);
  pop();

}

function doRotate(vect,pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);
    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);
    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);
    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;
    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;
    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;
	var px = vect.x;
	var py = vect.y;
	var pz = vect.z;
	vect.x = Axx*px + Axy*py + Axz*pz;
	vect.y = Ayx*px + Ayy*py + Ayz*pz;
	vect.z = Azx*px + Azy*py + Azz*pz;
		
	return vect;
}

function scalarProduct(a,b){
	return a.x*b.x+a.y*b.y+a.z*b.z;
}