import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FolderParams, Pane } from 'tweakpane';

export function createCDLFolder(pane: Pane, pass: ShaderPass, folderParams: FolderParams): void {
	const folder = pane.addFolder(folderParams);

	const params = {
		slope: { x: 1, y: 1, z: 1, w: 1 },
		slopeWheel: 1,
		offset: { x: 1, y: 1, z: 1, w: 0 },
		offsetWheel: 0,
		power: { x: 1, y: 1, z: 1, w: 1 },
		powerWheel: 1,
		saturation: 1,
	};

	const slopeParams = { label: 'slope (rgbm)', min: 0, max: 10, step: 0.01 };
	const offsetParams = { label: 'offset (rgbm)', min: -5, max: 5, step: 0.01 };
	const powerParams = { label: 'power (rgbm)', min: 0, max: 5, step: 0.01 };
	const wheelParams = { view: 'camerawheel', label: '', wide: true, amount: -0.001 };
	const saturationParams = {
		label: 'saturation',
		view: 'cameraring',
		series: 1,
		unit: { pixels: 40, ticks: 5, value: 1 },
		min: 0,
		max: 10,
		step: 0.05,
	};

	const slope = pass.uniforms.slope.value as THREE.Vector3;
	const offset = pass.uniforms.offset.value as THREE.Vector3;
	const power = pass.uniforms.power.value as THREE.Vector3;

	// Slope.

	folder.addBinding(params, 'slope', { ...slopeParams }).on('change', ({ value }) => {
		slope.set(value.x, value.y, value.z).multiplyScalar(value.w);
		params.slopeWheel = value.w;
		pane.refresh();
	});
	folder.addBinding(params, 'slopeWheel', { ...wheelParams }).on('change', ({ value }) => {
		slope.set(params.slope.x, params.slope.y, params.slope.z).multiplyScalar(value);
		params.slope.w = value;
		pane.refresh();
	});

	folder.addBlade({ view: 'separator' });

	// Offset.
	folder.addBinding(params, 'offset', { ...offsetParams }).on('change', ({ value }) => {
		offset.set(value.x, value.y, value.z).multiplyScalar(value.w);
		params.offsetWheel = value.w;
		pane.refresh();
	});
	folder.addBinding(params, 'offsetWheel', { ...wheelParams }).on('change', ({ value, last }) => {
		offset.set(params.offset.x, params.offset.y, params.offset.z).multiplyScalar(value);
		params.offset.w = value;
		pane.refresh();
	});

	folder.addBlade({ view: 'separator' });

	// Power.
	folder.addBinding(params, 'power', { ...powerParams }).on('change', ({ value }) => {
		power.set(value.x, value.y, value.z).multiplyScalar(value.w);
		params.powerWheel = value.w;
		pane.refresh();
	});
	folder.addBinding(params, 'powerWheel', { ...wheelParams }).on('change', ({ value, last }) => {
		power.set(params.power.x, params.power.y, params.power.z).multiplyScalar(value);
		params.power.w = value;
		pane.refresh();
	});

	folder.addBlade({ view: 'separator' });

	// Saturation.
	folder.addBinding(params, 'saturation', { ...saturationParams }).on('change', ({ value }) => {
		pass.uniforms.saturation.value = value;
	});
}
