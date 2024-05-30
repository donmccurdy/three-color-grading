import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FolderParams, Pane } from 'tweakpane';

interface GradeCDL {
	type: 'cdl';
	slope?: [number, number, number];
	offset?: [number, number, number];
	power?: [number, number, number];
	saturation?: number;
}

interface GradePrimary {
	type: 'primary';
	contrast: number;
	saturation: number;
}

const PRESETS: Record<string, GradeCDL | GradePrimary> = {
	'Very High Contrast': { type: 'primary', contrast: 1.57, saturation: 0.9 },
	'High Contrast': { type: 'primary', contrast: 1.4, saturation: 0.95 },
	'Medium High Contrast': { type: 'primary', contrast: 1.2, saturation: 1 },
	'Base Contrast': { type: 'primary', contrast: 1, saturation: 1 },
	'Medium Low Contrast': { type: 'primary', contrast: 0.9, saturation: 1.05 },
	'Low Contrast': { type: 'primary', contrast: 0.8, saturation: 1.1 },
	'Very Low Contrast': { type: 'primary', contrast: 0.7, saturation: 1.15 },
	Punchy: { type: 'cdl', slope: [1, 1, 1], power: [1.35, 1.35, 1.35], saturation: 1.4 },
	Golden: { type: 'cdl', slope: [1.0, 0.9, 0.5], power: [0.8, 0.8, 0.8], saturation: 0.8 },
};

export function createCDLFolder(pane: Pane, pass: ShaderPass, folderParams: FolderParams): void {
	const folder = pane.addFolder(folderParams);

	const params = {
		slope: { x: 0, y: 0, z: 0, w: 1 },
		slopeWheel: 1,
		offset: { x: 0, y: 0, z: 0, w: 0 },
		offsetWheel: 0,
		power: { x: 0, y: 0, z: 0, w: 1 },
		powerWheel: 1,
		saturation: 1,
		contrast: 1,
		preset: 'Base Contrast',
	};

	const slopeParams = {
		label: 'slope (rgbm)',
		x: { min: -5, max: 5, step: 0.01 },
		y: { min: -5, max: 5, step: 0.01 },
		z: { min: -5, max: 5, step: 0.01 },
		w: { min: 0, max: 10, step: 0.01 },
	};
	const offsetParams = {
		label: 'offset (rgbm)',
		x: { min: -5, max: 5, step: 0.01 },
		y: { min: -5, max: 5, step: 0.01 },
		z: { min: -5, max: 5, step: 0.01 },
		w: { min: -5, max: 5, step: 0.01 },
		step: 0.01,
	};
	const powerParams = {
		label: 'power (rgbm)',
		x: { min: -5, max: 5, step: 0.01 },
		y: { min: -5, max: 5, step: 0.01 },
		z: { min: -5, max: 5, step: 0.01 },
		w: { min: 0, max: 5, step: 0.01 },
		step: 0.01,
	};
	const wheelParams = { view: 'camerawheel', label: '', wide: true, amount: -0.001 };
	const saturationParams = {
		label: 'saturation',
		view: 'cameraring',
		series: 1,
		unit: { pixels: 50, ticks: 5, value: 1 },
		min: 0,
		max: 4,
		step: 0.02,
	};

	const slope = pass.uniforms.slope.value as THREE.Vector3;
	const offset = pass.uniforms.offset.value as THREE.Vector3;
	const power = pass.uniforms.power.value as THREE.Vector3;

	// Slope.

	folder.addBinding(params, 'slope', { ...slopeParams }).on('change', ({ value }) => {
		slope.set(value.x, value.y, value.z).addScalar(value.w);
		params.slopeWheel = value.w;
		pane.refresh();
	});
	folder
		.addBinding(params, 'slopeWheel', { ...wheelParams, min: 0, max: 10 })
		.on('change', ({ value }) => {
			slope.set(params.slope.x, params.slope.y, params.slope.z).addScalar(value);
			params.slope.w = value;
			pane.refresh();
		});

	folder.addBlade({ view: 'separator' });

	// Offset.
	folder.addBinding(params, 'offset', { ...offsetParams }).on('change', ({ value }) => {
		offset.set(value.x, value.y, value.z).addScalar(value.w);
		params.offsetWheel = value.w;
		pane.refresh();
	});
	folder
		.addBinding(params, 'offsetWheel', { ...wheelParams, min: -5, max: 5 })
		.on('change', ({ value }) => {
			offset.set(params.offset.x, params.offset.y, params.offset.z).addScalar(value);
			params.offset.w = value;
			pane.refresh();
		});

	folder.addBlade({ view: 'separator' });

	// Power.
	folder.addBinding(params, 'power', { ...powerParams }).on('change', ({ value }) => {
		power.set(value.x, value.y, value.z).addScalar(value.w);
		params.powerWheel = value.w;
		pane.refresh();
	});
	folder
		.addBinding(params, 'powerWheel', { ...wheelParams, min: 0, max: 5 })
		.on('change', ({ value }) => {
			power.set(params.power.x, params.power.y, params.power.z).addScalar(value);
			params.power.w = value;
			pane.refresh();
		});

	folder.addBlade({ view: 'separator' });

	// Saturation.
	folder.addBinding(params, 'saturation', { ...saturationParams }).on('change', ({ value }) => {
		pass.uniforms.saturation.value = value;
	});

	folder.addBlade({ view: 'separator' });

	// Contrast (NOT PART OF CDL).
	const contrastParams = {
		label: 'contrast',
		view: 'cameraring',
		series: 1,
		unit: { pixels: 50, ticks: 5, value: 1 },
		min: 0,
		max: 4,
		step: 0.02,
	};
	folder.addBinding(params, 'contrast', { ...contrastParams }).on('change', ({ value }) => {
		const s = value;
		slope.setScalar(s);
		params.slope.x = params.slope.y = params.slope.z = 0;
		params.slope.w = params.slopeWheel = s;

		const o = (1 - s) / 2;
		offset.setScalar(o);
		params.offset.x = params.offset.y = params.offset.z = 0;
		params.offset.w = params.offsetWheel = o;
	});

	folder.addBlade({ view: 'separator' });

	const presetParams = {
		options: Object.fromEntries(Object.keys(PRESETS).map((preset) => [preset, preset])),
	};
	folder.addBinding(params, 'preset', { ...presetParams }).on('change', ({ value }) => {
		const preset = PRESETS[value];
		console.log(preset);
		if (preset.type === 'cdl') {
			const s = preset.slope || [1, 1, 1];
			const o = preset.offset || [0, 0, 0];
			const p = preset.power || [1, 1, 1];

			slope.fromArray(s);
			params.slope.x = s[0];
			params.slope.y = s[1];
			params.slope.z = s[2];
			params.slope.w = params.slopeWheel = 0;

			offset.fromArray(o);
			params.offset.x = o[0];
			params.offset.y = o[1];
			params.offset.z = o[2];
			params.offset.w = params.offsetWheel = 0;

			power.fromArray(p);
			params.power.x = p[0];
			params.power.y = p[1];
			params.power.z = p[2];
			params.power.w = params.powerWheel = 0;

			pass.uniforms.saturation.value = preset.saturation || 1;
			params.saturation = preset.saturation || 1;
		} else {
			const s = preset.contrast;
			slope.setScalar(s);
			params.slope.x = params.slope.y = params.slope.z = 0;
			params.slope.w = params.slopeWheel = s;

			const o = (1 - s) / 2;
			offset.setScalar(o);
			params.offset.x = params.offset.y = params.offset.z = 0;
			params.offset.w = params.offsetWheel = o;

			pass.uniforms.saturation.value = preset.saturation;
			params.saturation = preset.saturation;
		}
		folder.refresh();
	});
}
