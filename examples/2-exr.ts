import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
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

const IMAGES = [
	'Sweep_sRGB_Linear_Half_Zip.exr',
	'blue_bar_709.exr',
	'Matas_Alexa_Mini_sample_BT709.exr',
	'mery_lightSaber_lin_srgb.exr',
	'red_xmas_rec709.exr',
	'Siren4_arri_alexa35_BT709.exr',
];

// renderer

const { innerWidth, innerHeight } = window;
const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.NoToneMapping; // pass through to ToneMappingShader.
renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass through to ToneMappingShader.
document.getElementById('container')!.appendChild(renderer.domElement);

// scene

const scene = new THREE.Scene();

// camera

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 1;
scene.add(camera);

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

const loader = new EXRLoader();
const content = new THREE.Mesh(
	new THREE.PlaneGeometry(),
	new THREE.MeshBasicMaterial({ color: 0xffffff }),
);
await loadImage(IMAGES[0]);
scene.add(content);

// ui

const pane = new Pane({ title: 'Settings' });
pane.registerPlugin(CamerakitPlugin);
createRenderFolder(pane);
createToneMappingFolder(pane, toneMappingPass);
createCDLFolder(pane, prelinCDLPass, { title: 'Pre-transform CDL (Linear)', expanded: false });
createCDLFolder(pane, toneMappingPass, { title: 'Pre-transform CDL (Log)', expanded: true });
createCDLFolder(pane, postCDLPass, { title: 'Post-transform CDL', expanded: false });
createImageFolder(pane);

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

function createImageFolder(pane: Pane) {
	const folder = pane.addFolder({ title: 'Image' });

	const params = {
		exr: IMAGES[0],
	};

	const options = Object.fromEntries(IMAGES.map((path) => [path, path]));

	folder.addBinding(params, 'exr', { options }).on('change', (event) => {
		loadImage(params.exr);
	});
}

async function loadImage(path: string): Promise<THREE.Texture> {
	if (content.material.map) {
		content.material.map.dispose();
	}
	const texture = await loader.loadAsync(`/images/${path}`);
	texture.colorSpace = THREE.LinearSRGBColorSpace;
	const aspect = texture.image.width / texture.image.height;
	content.scale.x = aspect > 1 ? 1 : 1 / aspect;
	content.scale.y = aspect > 1 ? 1 / aspect : 1;
	content.material.map = texture;
	return texture;
}
