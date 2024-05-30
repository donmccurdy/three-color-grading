/**
 * ASC CDL v1.2
 * https://en.wikipedia.org/wiki/ASC_CDL
 */

import { Vector3 } from 'three';

const CDLShader = {
	name: 'CDLShader',

	uniforms: {
		tDiffuse: { value: null },

		slope: { value: new Vector3(1, 1, 1) },
		offset: { value: new Vector3(0, 0, 0) },
		power: { value: new Vector3(1, 1, 1) },
		saturation: { value: 1 },
	},

	vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */ `

		#include <common>

		uniform sampler2D tDiffuse;

		uniform vec3 slope;
		uniform vec3 offset;
		uniform vec3 power;
		uniform float saturation;

		varying vec2 vUv;

		vec3 applyCDL( vec3 color ) {

			vec3 s = color * slope;
			vec3 o = s + offset;
			vec3 p = pow(max(o, 0.0), power);

			float luma = dot(p, vec3(0.2126, 0.7152, 0.0722));
			return max(luma + saturation * (p - luma), 0.0);

		}

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			gl_FragColor = vec4(applyCDL(texel.rgb), texel.a);

		}`,
};

export { CDLShader };
