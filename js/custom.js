/**
 * Initialize trackball controls to control the scene
 * 
 * @param {THREE.Camera} camera 
 * @param {THREE.Renderer} renderer 
 */
function initTrackballControls(camera, renderer) {
  var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.2;
  trackballControls.panSpeed = 0.8;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;
  trackballControls.keys = [65, 83, 68];

  return trackballControls;
}

var scene;
var camera;
var renderer;

function init(params) {

  // Gui controls
  var controls = new function() {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
  }

  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'bouncingSpeed', 0, 0.5);
  
  // Init the stat top left corner
  var stats = initStats();

  // On resize dimension
  window.addEventListener('resize', onResize, false);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);

  var planeGeometry = new THREE.PlaneGeometry(60, 20);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xAAAAAA
  });

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  plane.position.set(15, 0, 0);
  scene.add(plane);

  // create cube
  var cubeGeometry = new THREE.BoxGeometry(4,4,4);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000,
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-4, 3, 0);
  cube.castShadow = true;
  scene.add(cube);

  // create a sphere
  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777FF,
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(20, 4, 2);
  sphere.castShadow = true;
  scene.add(sphere);

  // Spolight
  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(-40, 40, -15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;

  scene.add(spotLight);

  // Camera position and point to
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  var step = 0;
  function renderScene() {
    stats.update();
    trackballControls.update(clock.getDelta());

    // Bounce the ball
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + 10 * (Math.cos(step));
    sphere.position.y = 2 + 10 * Math.abs((Math.sin(step)));

    // Move the cube
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }

  document.getElementById('webgl-output').appendChild(renderer.domElement);

  // Control camera
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  renderScene();

  console.log('Using three.Js version: ' + THREE.REVISION);
}


// Add the stats library
function initStats(type) {
  var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(tyoe) : 0;
  var stats = new Stats();

  stats.showPanel(panelType);
  document.body.appendChild(stats.dom);

  return stats;
}