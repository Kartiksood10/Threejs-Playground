import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";

import nebula from "../img/nebula.jpg";
import grass from "../img/grass1.jpg";
import stars from "../img/stars.jpg";
import moon from "../img/moon.jpg";

const monkeyUrl = new URL("../assets/Donkey.gltf", import.meta.url);
const monkeyUrl1 = new URL("../assets/Cow.gltf", import.meta.url);
const monkeyUrl2 = new URL(
  "../assets/Astronaut_RaeTheRedPanda.gltf",
  import.meta.url
);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// sets background color
//renderer.setClearColor(0x464646);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(15, 5, 10);
orbit.update();

// grid on which model is present
// new THREE.PlaneGeometry(size, divisions)
// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const textureloader = new THREE.TextureLoader();
const grassMat = textureloader.load(grass);
const geometry = new THREE.PlaneGeometry(20, 20);
// Increase the width while maintaining aspect ratio
geometry.scale.x = 4;

const material = new THREE.MeshBasicMaterial({
  map: grassMat,
  side: THREE.DoubleSide,
});

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  nebula,
  nebula,
  nebula,
  nebula,
]);

// const material = new THREE.MeshStandardMaterial({
//   transparent: false,
//   map: grassMat,
//   side: THREE.DoubleSide,
// });

const plane_grass = new THREE.Mesh(geometry, material);
scene.add(plane_grass);
plane_grass.rotateX(Math.PI * -0.5);

const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(10, 11, 7);
scene.add(directionLight);

const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientlight);

const spotlight = new THREE.SpotLight(0xffffff);
scene.add(spotlight);
spotlight.position.set(0, 8, 4);
spotlight.intensity = 1.2;
spotlight.angle = 0.45;
spotlight.penumbra = 0.3;
spotlight.castShadow = true;

// gui is used to create controls by which we can commit live changes on a scene
const gui = new dat.GUI();

// GLTF loader is used to load GLTF type 3d models
const assetLoader = new GLTFLoader();

// found the parameters of the 3d model from threejs editor
const options = {
  Main: 0x7c7c7c,
  "Main Light": 0x00ff00,
  "Main Dark": 0x00ffff,
  Hooves: 0xff0000,
  Hair: 0xff00ff,
  Muzzle: 0x00ff00,
  "Eye Dark": 0xffff00,
  "Eye White": 0x0000ff,
};

let mixer;
//let modelPosition = new THREE.Vector3();

// DONKEY

let donkey;
assetLoader.load(
  monkeyUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    donkey = model;
    model.position.set(1, 0, -5);
    //model.scale = new THREE.Vector3(2, 2, 2);
    //modelPosition.copy(model.position);
    //initialModelPosition = gltf.scene.position.clone();
    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
      }
    });

    //console.log(model.getObjectByName("Cube_6"));
    //model.getObjectByName("Cube_6").material.color.setHex(0x00ff00);
    gui.addColor(options, "Main").onChange(function (e) {
      model.getObjectByName("Cube").material.color.setHex(e);
    });
    gui.addColor(options, "Main Light").onChange(function (e) {
      model.getObjectByName("Cube_1").material.color.setHex(e);
    });
    gui.addColor(options, "Main Dark").onChange(function (e) {
      model.getObjectByName("Cube_2").material.color.setHex(e);
    });
    gui.addColor(options, "Hooves").onChange(function (e) {
      model.getObjectByName("Cube_3").material.color.setHex(e);
    });
    gui.addColor(options, "Hair").onChange(function (e) {
      model.getObjectByName("Cube_4").material.color.setHex(e);
    });
    gui.addColor(options, "Muzzle").onChange(function (e) {
      model.getObjectByName("Cube_5").material.color.setHex(e);
    });
    gui.addColor(options, "Eye Dark").onChange(function (e) {
      model.getObjectByName("Cube_6").material.color.setHex(e);
    });
    gui.addColor(options, "Eye White").onChange(function (e) {
      model.getObjectByName("Cube_7").material.color.setHex(e);
    });

    mixer = new THREE.AnimationMixer(model);
    const animation = gltf.animations[1];
    const action = mixer.clipAction(animation);
    action.play();

    //car1 = model;
    // mixer = new THREE.AnimationMixer(model); // convert animation clips to animation action
    // const clips = gltf.animations; // contains all animations present for the model

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    // clips.forEach(function(clip) {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// COW

let mixer1;
let cow;
assetLoader.load(
  monkeyUrl1.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    cow = model;
    model.position.set(1, 0, 5);
    model.scale.set(0.5, 0.5, 0.5);
    // Rotate the model by 180 degrees around the Y-axis
    model.rotation.y = Math.PI;
    // Move the model forward by 1 unit

    mixer1 = new THREE.AnimationMixer(model);
    const animation = gltf.animations[3];
    const action = mixer1.clipAction(animation);
    action.play();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// SPACE PANDA

let panda;
let mixer2;
assetLoader.load(
  monkeyUrl2.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    panda = model;
    model.position.set(-5, 3.5, 0);
    model.scale.set(0.5, 0.5, 0.5);
    // Rotate the model by 180 degrees around the Y-axis
    model.rotation.y = Math.PI / 2;

    // Making 2 animations run one after the other based on name
    // LoopOnce is used to execute an animation only once

    mixer2 = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const animation = THREE.AnimationClip.findByName(clips, "Walk");
    const action = mixer2.clipAction(animation);
    action.play();
    action.loop = THREE.LoopOnce;

    const animation1 = THREE.AnimationClip.findByName(clips, "Walk_Gun");
    const action1 = mixer2.clipAction(animation1);
    //action1.play();
    action1.loop = THREE.LoopOnce;

    mixer2.addEventListener("finished", function (e) {
      if (e.action._clip.name === "Walk_Gun") {
        action.reset();
        action.play();
      } else if (e.action._clip.name === "Walk") {
        action1.reset();
        action1.play();
      }
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// COLLISION DETECTION

//let animationTriggered = false;
// function detectCollision() {
//   // Get the bounding boxes of model1 and model2
//   const model1BoundingBox = new THREE.Box3().setFromObject(cow);
//   const model2BoundingBox = new THREE.Box3().setFromObject(donkey);

// const model1BoundingBox = new THREE.Box3(
//   new THREE.Vector3(),
//   new THREE.Vector3()
// );
// model1BoundingBox.setFromObject(donkey);
// console.log(model1BoundingBox);
// const model2BoundingBox = new THREE.Box3().setFromObject(cow);

// if (model1BoundingBox.intersectsBox(model2BoundingBox)) {
//   console.log("success");
// } else {
//   console.log("fail");
// }

// function playNewAnimation() {
//   const mixer = new THREE.AnimationMixer(donkey);
//   const animation = gltf.animations[2];
//   const action = mixer.clipAction(animation);
//   action.play();
// }

// donkey.geometry.computeBoundingBox();
// cow.geometry.computeBoundingBox();
// donkey.updateMatrixWorld();
// cow.updateMatrixWorld();

// var box1 = donkey.geometry.boundingBox.clone();
// box1.applyMatrix4(donkey.matrixWorld);

// var box2 = cow.geometry.boundingBox.clone();
// box2.applyMatrix4(cow.matrixWorld);

// if (box1.intersectsBox(box2)) {
//   console.log("successs");
// } else {
//   console.log("Fail");
// }

// Moving on pressing arrow KEYS

document.onkeydown = function (e) {
  if (e.key === "ArrowLeft") {
    donkey.position.x -= 1;
  }
  if (e.key === "ArrowRight") {
    donkey.position.x += 1;
  }
  if (e.key === "ArrowUp") {
    donkey.position.z += 1;
  }
  if (e.key === "ArrowDown") {
    donkey.position.z -= 1;
  }
};

// document.onkeydown = function (e) {
//   if (e.key === "a") {
//     cow.position.x -= 1;
//   }
//   if (e.key === "d") {
//     cow.position.x += 1;
//   }
//   if (e.key === "w") {
//     cow.position.z -= 1;
//   }
//   if (e.key === "s") {
//     cow.position.z += 1;
//   }
// };

// CREATING OBJECTS ON MOUSE CLICK

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane(); // imaginary plane on which we call setNormalAnd... method to help find mouse pointer
const raycaster = new THREE.Raycaster(); // method to find where user's mouse is pointing in threejs

const meshes = [];
const bodies = [];
//const groundPhysMat = new CANNON.material();
window.addEventListener("click", function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
  const sphereMesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.125, 30, 30),
    new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      metalness: 0,
      roughness: 0,
    })
  );
  scene.add(sphereMesh1);
  sphereMesh1.position.copy(intersectionPoint);

  //const spherePhysMat = new CANNON.material();
  const sphereBody1 = new CANNON.Body({
    mass: 0.3,
    shape: new CANNON.Sphere(0.125),
    position: new CANNON.Vec3(
      intersectionPoint.x,
      intersectionPoint.y,
      intersectionPoint.z
    ),
    //material: spherePhysMat,
  });

  // TO CREATE BOUNCE EFFECT OF BALLS ON CONTACT WITH THE GROUND

  // const planeSphereContactMat = new CANNON.ContactMaterial(
  //   groundPhysMat,
  //   spherePhysMat,
  //   { restitution: 0.3 }
  // );

  // world.addContactMaterial(planeSphereContactMat);

  world.addBody(sphereBody1);
  meshes.push(sphereMesh1);
  bodies.push(sphereBody1);
});

// BLACK CUBE WITH CUSTOM TEXTURE(PHYSICS WORLD)

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
// const boxMat = new THREE.MeshBasicMaterial({
//   color: 0xeb262a,
// });

let counter,
  textures = [],
  boxMat = [];

// iterate through all 6 sides of the cube
// applying texture to all sides
for (counter = 0; counter < 6; counter++) {
  textures[counter] = textureloader.load(stars);

  // creates material from previously stored texture
  boxMat.push(new THREE.MeshBasicMaterial({ map: textures[counter] }));
}

const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

// MOON

const sphereGeo = new THREE.SphereGeometry(1.5);
// const sphereMat = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true,
// });
const moonMat = textureloader.load(moon);
const sphereMat = new THREE.MeshBasicMaterial({
  map: moonMat,
  //side: THREE.DoubleSide,
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

// PHYSICS WORLD USING CANNON.JS

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0), // gravity below 9.81 speed
});

const timeStep = 1 / 60;

// ground on which materials stand

const groundBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(10, 10, 0.1)),
  // mass: 10, //gravity affects only if body has mass
  type: CANNON.Body.STATIC, // body is ground so no gravity-static
  //material: groundPhysMat,
});

world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make the ground horizontal

// giving physics properties to box and sphere and adding to the world

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
  position: new CANNON.Vec3(1, 20, 0),
});

world.addBody(boxBody);

const sphereBody = new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(1.5),
  position: new CANNON.Vec3(0, 15, 0),
});

world.addBody(sphereBody);
sphereBody.linearDamping = 0.2;

const clock = new THREE.Clock();
// ANIMATE FUNCTION

function animate() {
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
  //   const delta2 = clock_1.getDelta();
  //   mixer_1.update(delta2);

  if (mixer1) {
    mixer1.update(delta);
  }

  if (mixer2) {
    mixer2.update(delta);
  }

  // copying the mesh position to body position in the world.

  world.step(timeStep);
  plane_grass.position.copy(groundBody.position);
  plane_grass.quaternion.copy(groundBody.quaternion);

  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  for (let i = 0; i < meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }

  // Move the model forward by 0.01 unit

  //   if (cow) {
  //     cow.position.z -= 0.01;
  //   }

  //   if (donkey) {
  //     donkey.position.z += 0.01;
  //   }

  if (panda) {
    panda.position.x += 0.01;
  }

  //requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
