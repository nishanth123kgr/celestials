import {GLTFLoader} from './GLTFLoader.js'
import * as THREE from './three.module.js'
import {OrbitControls} from './OrbitControls.js'


var textureURL = "lroc_color_poles_16k.jpg"; 
var displacementURL = "ldem_64.jpg"; 
var worldURL = "starfield.png"
var bumpMapURL = "ldem_64.jpg"; // Added a dedicated bump map

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var canvas = document.querySelector("#myCanvas");
var renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

var controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;

document.body.appendChild( canvas );

var geometry = new THREE.SphereGeometry( 2,60,60 );

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load( textureURL );
var displacementMap = textureLoader.load( displacementURL );
var worldTexture = textureLoader.load( worldURL );
var bumpMap = textureLoader.load( bumpMapURL ); // Loaded the dedicated bump map

var material = new THREE.MeshPhongMaterial ( 
  { color: 0xffffff ,
  map: texture ,
     
 
  bumpMap: bumpMap, // Using the dedicated bump map
  bumpScale: 0.005,
   reflectivity:0, 
   shininess :0
  } 

);

var moon = new THREE.Mesh( geometry, material );


const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-100, 10,50);
scene.add(light);


var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 0, 0 );
scene.add(hemiLight );


var worldGeometry = new THREE.SphereGeometry( 1000,60,60 );
var worldMaterial = new THREE.MeshBasicMaterial ( 
  { color: 0xffffff ,
  map: worldTexture ,
  side: THREE.BackSide
  } 
);
var world = new THREE.Mesh( worldGeometry, worldMaterial );
scene.add( world );

scene.add( moon );
camera.position.z = 5;

moon.rotation.x = 3.1415*0.02;
moon.rotation.y = 3.1415*1.54;

var rotateMoon = false;

var gui = new dat.GUI();
gui.add(moon.rotation, 'x', 0, Math.PI * 2);
gui.add(moon.rotation, 'y', 0, Math.PI * 2);
gui.add(moon.rotation, 'z', 0, Math.PI * 2);
gui.add(light, 'intensity', 0, 10);
gui.add(light.position, 'x', -100, 100);
gui.add(light.position, 'y', -100, 100);
gui.add(light.position, 'z', -100, 100);
gui.add(hemiLight, 'intensity', 0, 10);
gui.add(hemiLight.position, 'x', -100, 100);
gui.add(hemiLight.position, 'y', -100, 100);
gui.add(hemiLight.position, 'z', -100, 100);
gui.add({ambientLight: false}, 'ambientLight').onChange(function(value) {
  if (value) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));
  } else {
    scene.remove(scene.children.find(child => child.type === 'AmbientLight'));
  }
});
gui.add({directionalLight: true}, 'directionalLight').onChange(function(value) {
  if (value) {
    scene.add(light);
  } else {
    scene.remove(light);
  }
});
gui.add({hemiLight: true}, 'hemiLight').onChange(function(value) {
  if (value) {
    scene.add(hemiLight);
  } else {
    scene.remove(hemiLight);
  }
});
gui.add({rotateMoon: false}, 'rotateMoon').onChange(function(value) {
  rotateMoon = value;
});

function animate() {
	requestAnimationFrame( animate );
  if (rotateMoon) {
    moon.rotation.y += 0.001;
    moon.rotation.x += 0.0001;
  }

	renderer.render( scene, camera );
}
animate();


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);








