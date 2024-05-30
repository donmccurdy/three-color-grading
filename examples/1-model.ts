import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Pane } from 'tweakpane';
import * as CamerakitPlugin from '@tweakpane/plugin-camerakit';
import {
	CDLShader,
	ToneMappingShader,
	createCDLFolder,
	createRenderFolder,
	createToneMappingFolder,
} from 'three-color-grading';

// renderer

const { innerWidth, innerHeight } = window;
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.NoToneMapping; // pass through to ToneMappingShader.
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass through to ToneMappingShader.
document.getElementById('container')!.appendChild(renderer.domElement);

// scene & lights

const environment = new RoomEnvironment(renderer);
const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.environment = pmremGenerator.fromScene(environment).texture;
environment.dispose();

// camera & controls

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(-0.5, 0.4, -0.35);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 0.1;
controls.maxDistance = 2;

// composer

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const prelinCDLPass = new ShaderPass(CDLShader);
const toneMappingPass = new ShaderPass(ToneMappingShader);
const postCDLPass = new ShaderPass(CDLShader);
composer.addPass(renderPass);
composer.addPass(prelinCDLPass);
composer.addPass(toneMappingPass);
composer.addPass(postCDLPass);

// loader

const loader = new GLTFLoader();

loader.load(
	'/models/Mixer.glb',
	({ scene: model }) => {
		const bbox = new THREE.Box3().setFromObject(model);
		const bboxCenter = bbox.getCenter(new THREE.Vector3());
		model.position.sub(bboxCenter);
		scene.add(model);
	},
	undefined,
	console.error,
);

// ui

const pane = new Pane({ title: 'Settings' });
pane.registerPlugin(CamerakitPlugin);
createRenderFolder(pane);
createToneMappingFolder(pane, toneMappingPass);
createCDLFolder(pane, prelinCDLPass, { title: 'Pre-transform CDL (Linear)', expanded: false });
createCDLFolder(pane, toneMappingPass, { title: 'Pre-transform CDL (Log)', expanded: false });
createCDLFolder(pane, postCDLPass, { title: 'Post-transform CDL', expanded: false });

// init

window.addEventListener('resize', onResize);
animate();

// events

function animate() {
	requestAnimationFrame(animate);
	composer.render();
}

function onResize() {
	const { innerWidth, innerHeight } = window;
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
	composer.setSize(innerWidth, innerHeight);
}
