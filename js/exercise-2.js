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

  var stats = initStats();

  // On resize dimension
  window.addEventListener('resize', onResize, false);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  scene.add(camera);

  var planeGeometry = new THREE.PlaneGeometry(40,40,1,1);
  var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;

  // scene.add(plane); 

  // position and point the camera to the center of the scene
  camera.position.x = -40;
  camera.position.y = 20;
  camera.position.z = 40;
  camera.lookAt(scene.position);
  console.log(scene.position);
  

  var ambientLight = new THREE.AmbientLight(0x3c3c3c);
  scene.add(ambientLight);

  var spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  document.getElementById("webgl-output").appendChild(renderer.domElement);

  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;

    this.removeCube = function() {
      var allChildren = scene.children;
      var lastObject = allChildren[allChildren.length - 1];
      if(lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject);
        this.numberOfObjects = scene.children.length;
      }
    }

    this.addCube = function() {
      var cubeSize = Math.ceil(Math.random() * 3);
      var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      var cubeMaterial = new THREE.MeshLambertMaterial({ 
        color: Math.random() * 0xFF0000
      });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;

      // cube.name = "cube-" + scene.children.length;
      cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
      cube.position.y = Math.round((Math.random() * 20));
      cube.position.z = (-20 * Math.random()) + Math.round((Math.random() * planeGeometry.parameters.height));

      scene.add(cube);
      this.numberOfObjects = scene.children.length;
    }

    this.outputObjects = function () {
      console.log(scene.children);
    }
  };

  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'outputObjects');
  gui.add(controls, 'numberOfObjects').listen();

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  render();
  
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    scene.traverse(function(e){
      if (e instanceof THREE.Mesh && e != plane) {

        e.rotation.x += controls.rotationSpeed;
        e.rotation.y += controls.rotationSpeed;
        e.rotation.z += controls.rotationSpeed;
      }

    });
    
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}

// Add the stats library
function initStats(type) {
  var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(tyoe) : 0;
  var stats = new Stats();

  stats.showPanel(panelType);
  document.body.appendChild(stats.dom);

  return stats;
}