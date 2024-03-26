import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { Pane } from 'tweakpane';

export function createRenderFolder(gui: Pane): void {
	const folder = gui.addFolder({ title: 'Render' });

	enum Renderer {
		RASTERIZER = 'rasterizer',
		PATHTRACER = 'pathtracer',
	}

	const params = { renderer: Renderer.RASTERIZER };

	const rendererCtrl = folder.addBinding(params, 'renderer', {
		options: {
			Rasterizer: Renderer.RASTERIZER,
			Pathtracer: Renderer.PATHTRACER,
		},
	});
	rendererCtrl.disabled = true;
}

export function createToneMappingFolder(pane: Pane, pass: ShaderPass): void {
	const folder = pane.addFolder({ title: 'Transform' });

	const params = {
		exposure: 0,
		toneMapping: THREE.AgXToneMapping,
	};

	folder
		.addBinding(params, 'toneMapping', {
			options: {
				AgX: THREE.AgXToneMapping,
				'ACES Filmic': THREE.ACESFilmicToneMapping,
				Commerce: THREE.NeutralToneMapping,
				Reinhard: THREE.ReinhardToneMapping,
				Cineon: THREE.CineonToneMapping,
				None: THREE.LinearToneMapping,
			},
		})
		.on('change', (event) => {
			pass.uniforms.toneMapping.value = event.value;
		});

	folder
		.addBinding(params, 'exposure', {
			view: 'cameraring',
			series: 1,
			unit: { pixels: 40, ticks: 5, value: 1 },
			min: -5,
			max: 5,
			step: 0.05,
		})
		.on('change', (event) => {
			pass.uniforms.exposure.value = Math.pow(2, event.value);
		});
}
