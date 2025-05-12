
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { threshold } from 'three/tsl';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


scene.add(new THREE.AmbientLight(0xffffff, 0.2));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;
scene.add(dirLight);


const clickableObjects = [];

function createFloor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xf9c834 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(100, 2, 100);
    mesh.position.set(0, -1, 3);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
}

function createObject(geometry, material, position) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    clickableObjects.push(mesh);
    return mesh;
}

function createAllObjects() {
    createObject(new THREE.BoxGeometry(6, 6, 6), new THREE.MeshPhongMaterial({ color: 0xDC143C }), new THREE.Vector3(15, 3, 15));
    createObject(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshPhongMaterial({ color: 0x43a1f4 }), new THREE.Vector3(15, 4, -15));
    createObject(new THREE.CylinderGeometry(4, 4, 6, 32), new THREE.MeshPhongMaterial({ color: 0xff5733 }), new THREE.Vector3(-15, 3, 15));
    createObject(new THREE.ConeGeometry(3, 8, 32), new THREE.MeshPhongMaterial({ color: 0x9933ff }), new THREE.Vector3(0, 4, -20));
    createObject(new THREE.TorusGeometry(3, 1, 16, 100), new THREE.MeshPhongMaterial({ color: 0x00ff99 }), new THREE.Vector3(-15, 5, -15));
}


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let outlineMesh = null;

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, false);

    if (intersects.length > 0) {
        const picked = intersects[0].object;
        if (selectedObject !== picked) {
            if (outlineMesh) {
                scene.remove(outlineMesh);
                outlineMesh.geometry.dispose();
                outlineMesh.material.dispose();
                outlineMesh = null;
            }

            selectedObject = picked;

            
            outlineMesh = selectedObject.clone();
            outlineMesh.material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                side: THREE.BackSide
            });
            outlineMesh.scale.multiplyScalar(1.1);
            scene.add(outlineMesh);
        }
    }
});


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


createFloor();
createAllObjects();
animate();
