var renderer;
var geometry;

function setup() {
  
  // we need to remember the renderer that is created so
  // we can call some of its internal methods later
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();

  // set up the camera. the geometry is in the x,y plane
  // so the camera is below the z axis lookup up at (0,0,0)
  camera(0, -600, 300, 0, 0, 0, 0, -1, 0);

  // create the geometry. this is really just a copy of
  // the built-in `plane` geometry.
  // there's 10,000 points on the surface.
  geometry = new p5.Geometry(100, 100, function() {
    for (var y = 0; y <= this.detailY; y++) {
      var v = y / this.detailY;
      for (var x = 0; x <= this.detailX; x++) {
        var u = x / this.detailX;
        var p = new p5.Vector(u - 0.5, v - 0.5, 0);
        this.vertices.push(p);
        this.uvs.push(u, v);
      }
    }
  });
}

function draw() {
  var tt = millis();

  background(0);

  // calculate the sun & moon's positions from spherical angles
  var sunPos = p5.Vector.fromAngles(tt / 5000, PI / 4, 1000);
  var moonPos = p5.Vector.fromAngles(PI + tt / 5000, PI / 4, 1000);
  
  // add spheres where the lights are going to be
  push();
  fill(255, 250, 136);
  translate(sunPos);
  sphere(60);
  pop();

  push();
  translate(moonPos);
  fill(245);
  sphere(60);
  pop();

  // loop through the geometry's points
  // setting the z coordinate based on some perlin noise
  for (var y = 0; y <= geometry.detailY; y++) {
    for (var x = 0; x <= geometry.detailX; x++) {
      var v = noise(
        4 * x / geometry.detailX,
        4 * y / geometry.detailY,
        tt / 10000
      );
      // just some simple cropping to simulate 'lakes'
      v = map(v, 0, 1, -0.5, 1);
      if (v < 0) v = 0;
      // squaring the value makes the peaks more pointy
      // and the valleys smoother
      v = v * v;
      // set the vertex's z coordinate
      geometry.vertices[y * (geometry.detailX + 1) + x].z = v;
    }
  }

  fill(255);

  // add the sun & moon lights
  pointLight(255, 250, 136, sunPos);
  pointLight(150, 150, 150, moonPos);

  // re-compute the faces & normals
  geometry.computeFaces().computeNormals();
  
  // update the webgl buffers
  renderer.createBuffers("!", geometry);
  
  // render the geometry
  renderer.drawBuffersScaled("!", 1000, 1000, 500);
}
