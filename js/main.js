const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//=============== Global Variables =================
const start_position = 3;
const end_position = -start_position;
const text = document.querySelector(".text");
const TIME_LIMIT = 20;
let gameStat = "loading";
let isLookingBackward = false;

// ==================================================

const createCube = (size, positionX, rotY = 0, color = 0xfbc851) => {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.rotation.y = rotY;
  scene.add(cube);
  return cube;
};

camera.position.z = 5;

renderer.setClearColor(0xb7c3f3, 1);
const loader = new THREE.GLTFLoader();
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

const delay = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

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
    gsap.to(this.doll.rotation, { y: -3.15, duration: 0.45 });
    setTimeout(() => (isLookingBackward = true), 450);
  }
  lookForward() {
    gsap.to(this.doll.rotation, { y: 0, duration: 0.45 });
    setTimeout(() => (isLookingBackward = false), 150);
  }
  async start() {
    this.lookBackward();
    await delay(Math.random() * 1000 + 1000);
    this.lookForward();
    await delay(Math.random() * 1000 + 1000);
    this.start();
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
    this.player = sphere;
    this.playerInfo = {
      positionX: start_position,
      velocity: 0,
    };
  }
  run() {
    this.playerInfo.velocity = 0.03;
  }
  stop() {
    gsap.to(this.playerInfo, { velocity: 0, duration: 0.5 });
  }
  check() {
    if (this.playerInfo.velocity > 0 && isLookingBackward) {
      gameStat = "over";
      text.innerText = "Shots fired!";
    }
    if (this.playerInfo.positionX < end_position) {
      gameStat = "over";
      text.innerText = "Survived";
    }
  }
  update() {
    this.check();
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }
}

const player = new Player();

const createTrack = () => {
  createCube({ w: start_position * 2 + 0.21, h: 1.5, d: 1 }, 0, 0, 0xe5a716).position.z = -1;
  createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.4);
  createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.4);
};

createTrack();

let doll = new Doll();

const startGame = () => {
  let progressBar = createCube({ w: 5, h: 0.1, d: 1 }, 0);
  progressBar.position.y = 3.35;
  gsap.to(progressBar.scale, { x: 0, duration: TIME_LIMIT });
  doll.start();
  setTimeout(() => {
    if (gameStat !== "over") {
      text.innerText = "You ran out of time, shots fired";
      gameStat = "over";
    }
  }, TIME_LIMIT * 1000);
  gameStat = "started";
};

const init = async () => {
  await delay(1000);
  text.innerText = "Starting in 3";
  await delay(1000);
  text.innerText = "Starting in 2";
  await delay(1000);
  text.innerText = "Starting in 1";
  await delay(1000);
  text.innerText = "Gooo";
  await delay(1000);
  startGame();
};

const animate = () => {
  if (gameStat == "over") return;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  player.update();
};

init();
animate();

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onWindowResize, false);

window.addEventListener("keydown", (e) => {
  if (gameStat !== "started") return;
  if (e.key === "ArrowUp") {
    player.run();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") {
    player.stop();
  }
});
