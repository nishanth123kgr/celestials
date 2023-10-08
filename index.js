import {GLTFLoader} from './GLTFLoader.js'
import * as THREE from './three.module.js'
import {OrbitControls} from './OrbitControls.js'


var scene = new THREE.Scene();
let textureLoader = new THREE.TextureLoader();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1 ,1000);

var renderer = new THREE.WebGL1Renderer({ antialias: true, physicallyCorrectLights: true, outputEncoding: THREE.sRGBEncoding, gammaOutput: true, gammaFactor: 2.2});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)


let pointer = new THREE.Vector2
let touch = new THREE.Vector2
let raycaster = new THREE.Raycaster()

var loader = new GLTFLoader();
var obj;
var obj2;
  
var textureURL = "lroc_color_poles_8k.jpg"; 
var displacementURL = "ldem_64.jpg"; 
var worldURL = "starfield.png"
var bumpMapURL = "ldem_64.jpg";

var texture = textureLoader.load( textureURL );
var displacementMap = textureLoader.load( displacementURL );
var worldTexture = textureLoader.load( worldURL );
var bumpMap = textureLoader.load( bumpMapURL );
var geometry = new THREE.SphereGeometry( 5,60,60 );
var material = new THREE.MeshPhongMaterial ( 
  { color: 0xffffff ,
  map: texture ,
     
 
  bumpMap: bumpMap, // Using the dedicated bump map
  bumpScale: 0.01,
   reflectivity:0, 
   shininess :0
  } 

);
var moon = new THREE.Mesh( geometry, material );
scene.add( moon );


scene.background = new THREE.Color(0x000000);
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-100,10,50);
camera.position.set(0,0,10);
scene.add(light);

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5);
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 0, 0 );
scene.add( hemiLight );
//scene.add(moon)


let backgroundGeo = new THREE.SphereGeometry(75, 32, 32);
let backgroundM = new THREE.MeshBasicMaterial({
  side: THREE.BackSide
});
let background = new THREE.Mesh(backgroundGeo, backgroundM);


textureLoader.crossOrigin = true;
textureLoader.load(
  'starfield.png',
  function(texture) {
    backgroundM.map = texture;
    scene.add(background);
  }
);
let mesh = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1,20,20),
  new THREE.MeshBasicMaterial({color: 0xff0000})
);
async function loadJSON(url) {
  const req = await fetch(url);
  return req.json();
}

let countryInfos;
let group = new THREE.Group()
async function loadCountryData() {
  countryInfos = await loadJSON('sm.json');  

  const lonFudge = Math.PI * 1.5;
  const latFudge = Math.PI;
  // these helpers will make it easy to position the boxes
  // We can rotate the lon helper on its Y axis to the longitude
  const lonHelper = new THREE.Object3D();
  // We rotate the latHelper on its X axis to the latitude
  const latHelper = new THREE.Object3D();
  lonHelper.add(latHelper);
  // The position helper moves the object to the edge of the sphere
  const positionHelper = new THREE.Object3D();
  positionHelper.position.z = 5;
  latHelper.add(positionHelper);

  const labelParentElem = document.querySelector('#labels');
  for (const countryInfo of countryInfos) {
    const {Lat, Long, Coord} = countryInfo;

    // adjust the helpers to point to the latitude and longitude
    lonHelper.rotation.y = THREE.MathUtils.degToRad(Long) + lonFudge;
    latHelper.rotation.x = THREE.MathUtils.degToRad(Lat) + latFudge;

    // get the position of the lat/lon
    positionHelper.updateWorldMatrix(true, false);
    const position = new THREE.Vector3();
    positionHelper.getWorldPosition(position);
    countryInfo.position = position;

    // add an element for each country
    const elem = document.createElement('div');
    elem.innerHTML =`<div class="loadingio-spinner-ripple-8963hj6n0do"><div class="ldio-6714jzqvamn">
    <div></div><div></div>
    </div></div>
    <style type="text/css">
    @keyframes ldio-6714jzqvamn {
      0% {
        top: 48px;
        left: 48px;
        width: 0;
        height: 0;
        opacity: 1;
      }
      100% {
        top: 24px;
        left: 24px;
        width: 48px;
        height: 48px;
        opacity: 0;
      }
    }.ldio-6714jzqvamn div {
      position: absolute;
      border-width: 2px;
      border-style: solid;
      opacity: 1;
      border-radius: 50%;
      animation: ldio-6714jzqvamn 1.408450704225352s cubic-bezier(0,0.2,0.8,1) infinite;
    }.ldio-6714jzqvamn div:nth-child(1) {
      border-color: #e90c59;
      animation-delay: 0s;
    }
    .ldio-6714jzqvamn div:nth-child(2) {
      border-color: #e90c59;
      animation-delay: -0.704225352112676s;
    }
    .loadingio-spinner-ripple-8963hj6n0do {
      width: 45px;
      height: 45px;
      display: inline-block;
      overflow: hidden;
      background: none;
    }
    .ldio-6714jzqvamn {
      width: 100%;
      height: 100%;
      position: relative;
      transform: translateZ(0) scale(0.54);
      backface-visibility: hidden;
      transform-origin: 0 0; /* see note above */
    }
    .ldio-6714jzqvamn div { box-sizing: content-box; }
    </style>`;
    labelParentElem.appendChild(elem);
    countryInfo.elem = elem;
    
    const circleGeometry =  new THREE.SphereGeometry(4/50,30,30)
    const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true,
            opacity: 0})
    
    const circle = new THREE.Mesh(circleGeometry, circleMaterial)
    circle.userData = countryInfo
    console.log(Coord)        
    let cr = Coord

    circle.position.set(cr[0], cr[1], cr[2])
    group.add(circle)
  }
  
}
loadCountryData();


const tempV = new THREE.Vector3();
const cameraToPoint = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const normalMatrix = new THREE.Matrix3();
 
function updateLabels() {
  // exit if we have not yet loaded the JSON file
  if (!countryInfos) {
    return;
  }
 
  const minVisibleDot = 0.5;
  // get a matrix that represents a relative orientation of the camera
  normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
  // get the camera's position
  camera.getWorldPosition(cameraPosition);
  for (const countryInfo of countryInfos) {
    const {position, elem,Year,Day} = countryInfo;
    var selectElement = document.getElementById('year');
var selectedYear = selectElement.value;

var selectElement2 = document.getElementById('Day');
var selectedDay = selectElement2.value;
var type = document.getElementById("type");
var selectedValue = type.value;
  if(selectedValue == 'sw'){
if (selectedYear != Year || selectedDay != Day) {
  elem.style.display = 'none';
  continue;
 }
  }
 
    // Orient the position based on the camera's orientation.
    // Since the sphere is at the origin and the sphere is a unit sphere
    // this gives us a camera relative direction vector for the position.
    tempV.copy(position);
    tempV.applyMatrix3(normalMatrix);
 
    // compute the direction to this position from the camera
    cameraToPoint.copy(position);
    cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();
 
    // get the dot product of camera relative direction to this position
    // on the globe with the direction from the camera to that point.
    // 1 = facing directly towards the camera
    // 0 = exactly on tangent of the sphere from the camera
    // < 0 = facing away
    const dot = tempV.dot(cameraToPoint);
 
    // if the orientation is not facing us hide it.
    
    if (dot >= minVisibleDot) {
      elem.style.display = 'none';
      continue;
    }
 
    // restore the element to its default display style
    elem.style.display = '';
 
    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    tempV.copy(position);
    tempV.project(camera);
 
    // convert the normalized position to CSS coordinates
    const x = (tempV.x *  .5 + .5) * renderer.domElement.clientWidth;
    const y = (tempV.y * -.5 + .5) * renderer.domElement.clientHeight;
 
    // move the elem to that position
    countryInfo.elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
 
    // set the zIndex for sorting
    elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
  }
}
scene.add(group)

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onTouch(event){
touch.x = +(event.changedTouches[0].clientX / window.innerWidth) * 2 -1;

touch.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;


raycaster.setFromCamera( touch, camera );
        

const intersects = raycaster.intersectObjects( scene.children );
if(intersects.length>0){
    let selectedPiece = intersects[0].object.userData
    console.log(selectedPiece)  

    }

  }



function onWindowResize() {
         
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
         
  renderer.setSize( window.innerWidth, window.innerHeight );
         
  }


addEventListener( 'pointerdown', onDocumentMouseDown, false );
function onDocumentMouseDown( event ) 
  {
      raycaster.setFromCamera( pointer, camera );

      const intersects = raycaster.intersectObjects( scene.children );
      if(intersects.length>0){
          let selectedPiece = intersects[0].object.userData
          
          if(selectedPiece.Lat!=undefined){
            document.getElementById("year2").textContent = selectedPiece.Year;
document.getElementById("day").textContent = selectedPiece.Day;
document.getElementById("detection_time").textContent = selectedPiece.H+' Hrs '+ selectedPiece.M+' Min '+ selectedPiece.S +' sec';
document.getElementById("latitude").textContent = selectedPiece.Lat;
document.getElementById("longitude").textContent = selectedPiece.Long;
document.getElementById("magnitude").textContent = selectedPiece.Magnitude;
document.getElementById("quake_type").textContent = selectedPiece.type;
document.getElementById("quake_type2").textContent = selectedPiece.Station;

          }
        
  
      }
}
var lightIntensitySlider = document.getElementById('light_intensity');
lightIntensitySlider.addEventListener('input', function() {
  var newIntensity = parseFloat(lightIntensitySlider.value);
  hemiLight.intensity = newIntensity;
});


var mapElement = document.getElementById("map");


// Add an event listener for the "change" event
mapElement.addEventListener("change", function() {
  // Get the selected value
  var selectedValue = mapElement.value;

  // Check the selected value and change the material accordingly
  if (selectedValue === 'hill') {
    moon.material = new THREE.MeshBasicMaterial({ map: textureLoader.load('lroc_color_poles_16k.jpg') });
  } else if (selectedValue === 'gravity') {
    moon.material = new THREE.MeshBasicMaterial({ map: textureLoader.load('gggrx_1200a_boug_l1200.eq.jpg') });
  }
  else{
    moon.material = new THREE.MeshBasicMaterial({ map: textureLoader.load('lroc_color_poles_8k.jpg')});
  }
});

var type = document.getElementById("type");

// Add an event listener for the "change" event
type.addEventListener("change", function() {
  // Get the selected value
  var selectedValue = type.value;
  if(selectedValue == 'sw'){
    console.log("yes");
    populateSelect();

  }
  
});

function populateSelect() {
  var selectElement = document.getElementById('year');
  var selectElement2 = document.getElementById('Day');

  // Create sets to store unique values for Year and Day
  var uniqueYears = new Set();
  var uniqueDays = new Set();

  for (const countryInfo of countryInfos) {
    const { Year, Day } = countryInfo;

    // Check if the Year is not already added
    if (!uniqueYears.has(Year)) {
      var option = document.createElement('option');
      option.value = Year;
      option.textContent = Year;
      selectElement.appendChild(option);

      // Add the Year to the set to mark it as added
      uniqueYears.add(Year);
    }

    // Check if the Day is not already added
    if (!uniqueDays.has(Day)) {
      var option2 = document.createElement('option');
      option2.value = Day;
      option2.textContent = Day;
      selectElement2.appendChild(option2);

      // Add the Day to the set to mark it as added
      uniqueDays.add(Day);
    }
  }
}


//changeGuiOpacity(0.5)
//window.addEventListener('click', onClick);  
window.addEventListener('pointermove', onPointerMove)      
//window.addEventListener('click', onClick);
window.addEventListener('touchend', onTouch)
window.addEventListener('resize', onWindowResize)



//changeGuiOpacity(0.5)
//window.addEventListener('click', onClick);  
window.addEventListener('pointermove', onPointerMove)      
//window.addEventListener('click', onClick);
window.addEventListener('touchend', onTouch)
window.addEventListener('resize', onWindowResize)

function animate(){

    window.requestAnimationFrame(animate);
   
   
    background.rotation.y += 0.001;
    
    updateLabels();
    
    renderer.render(scene,camera);
}
animate();
