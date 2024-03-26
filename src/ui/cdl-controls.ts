import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FolderParams, Pane } from 'tweakpane';

export function createCDLFolder(pane: Pane, pass: ShaderPass, folderParams: FolderParams): void {
	const folder = pane.addFolder(folderParams);

	const params = {
		slope: { x: 1, y: 1, z: 1 },
		slopeWheel: 0,
		offset: { x: 0, y: 0, z: 0 },
		offsetWheel: 0,
		power: { x: 1, y: 1, z: 1 },
		powerWheel: 0,
		saturation: 1,
	};

	const slopeParams = { min: 0, max: 10, step: 0.01 };
	const offsetParams = { min: -5, max: 5, step: 0.01 };
	const powerParams = { min: 0, max: 5, step: 0.01 };
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
		slope.set(value.x, value.y, value.z);
	});
	folder.addBinding(params, 'slopeWheel', { ...wheelParams }).on('change', ({ value, last }) => {
		const { x, y, z } = params.slope;
		slope.set(x + value, y + value, z + value).clampScalar(slopeParams.min, slopeParams.max);
		if (last) {
			params.slope.x = slope.x;
			params.slope.y = slope.y;
			params.slope.z = slope.z;
			params.slopeWheel = 0;
			pane.refresh();
		}
	});

	folder.addBlade({ view: 'separator' });

	// Offset.
	folder.addBinding(params, 'offset', { ...offsetParams }).on('change', ({ value }) => {
		pass.uniforms.offset.value.set(value.x, value.y, value.z);
	});
	folder.addBinding(params, 'offsetWheel', { ...wheelParams }).on('change', ({ value, last }) => {
		const { x, y, z } = params.offset;
		offset.set(x + value, y + value, z + value).clampScalar(offsetParams.min, offsetParams.max);
		if (last) {
			params.offset.x = offset.x;
			params.offset.y = offset.y;
			params.offset.z = offset.z;
			params.offsetWheel = 0;
			pane.refresh();
		}
	});

	folder.addBlade({ view: 'separator' });

	// Power.
	folder.addBinding(params, 'power', { ...powerParams }).on('change', ({ value }) => {
		pass.uniforms.power.value.set(value.x, value.y, value.z);
	});
	folder.addBinding(params, 'powerWheel', { ...wheelParams }).on('change', ({ value, last }) => {
		const { x, y, z } = params.power;
		power.set(x + value, y + value, z + value).clampScalar(powerParams.min, powerParams.max);
		if (last) {
			params.power.x = power.x;
			params.power.y = power.y;
			params.power.z = power.z;
			params.powerWheel = 0;
			pane.refresh();
		}
	});

	folder.addBlade({ view: 'separator' });

	// Saturation.
	folder.addBinding(params, 'saturation', { ...saturationParams }).on('change', ({ value }) => {
		pass.uniforms.saturation.value = value;
	});
}
