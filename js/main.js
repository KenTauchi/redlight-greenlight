const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const start_position = 3;
const end_position = -start_position;

const createCube = (size, rot, positionX, color = 0xfbc851) => {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.rotation.x = rot.x;
  cube.rotation.y = rot.y;
  scene.add(cube);

  return cube;
};

camera.position.z = 5;

renderer.setClearColor(0xb7c3f3, 1);
const loader = new THREE.GLTFLoader();
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

class Doll {
  constructor() {
    loader.load("../models/scene.gltf", (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(0.4, 0.4, 0.4);
      gltf.scene.position.set(0, -1, 0.3);
      this.doll = gltf.scene;
    });
  }

  lookBackward() {
    // this.doll.rotation.y = -3.15;
    gsap.to(this.doll.rotation, { y: -3.15, duration: 0.45 });
  }
  lookForward() {
    // this.doll.rotation.y = 0;
    gsap.to(this.doll.rotation, { y: 0, duration: 0.45 });
  }
}

class Player {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.3, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: "0xffffff" });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = 1.4;
    sphere.position.x = start_position;
    scene.add(sphere);
  }
}

const player = new Player();

const createTrack = () => {
  createCube({ w: start_position * 2, h: 1.5, d: 1 }, { x: 0, y: 0 }, 0, 0xe5a716).position.z =
    -0.8;
  createCube({ w: 0.2, h: 1.5, d: 1 }, { x: 0, y: 0 }, start_position);
  createCube({ w: 0.2, h: 1.5, d: 1 }, { x: 0, y: 0 }, end_position);
};

createTrack();

let doll = new Doll();
setTimeout(() => {
  doll.lookBackward();
}, 1000);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onWindowResize, false);
