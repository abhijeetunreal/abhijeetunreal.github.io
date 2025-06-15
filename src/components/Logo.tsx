
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FluidMaterial = shaderMaterial(
  // Uniforms
  {
    u_time: 0,
    u_mouse: new THREE.Vector2(0, 0),
    u_color1: new THREE.Color('hsl(130, 100%, 50%)'), // --primary
    u_color2: new THREE.Color('hsl(220, 10%, 30%)'), // --accent
    u_color3: new THREE.Color('hsl(220, 10%, 20%)'), // --secondary
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    varying vec2 vUv;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 );
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vec2 centeredUv = vUv - 0.5;
      float dist = length(centeredUv);

      if (dist > 0.5) discard;

      // Mouse interaction
      float mouseDist = distance(vUv, u_mouse);
      float mouseEffect = smoothstep(0.3, 0.0, mouseDist);

      // Noise calculations for fluid effect
      float noise = snoise(vec3(centeredUv * (3.0 - mouseEffect * 1.5), u_time * 0.2));
      float noise2 = snoise(vec3(centeredUv * 5.0 + noise * 0.5, u_time * 0.3));

      // Color mixing
      vec3 color = mix(u_color1, u_color2, smoothstep(0.4, 0.6, noise));
      color = mix(color, u_color3, smoothstep(0.4, 0.6, noise2));
      
      // Add a highlight on mouse interaction
      color = mix(color, vec3(1.0), mouseEffect * 0.3);
      
      // Add a shimmering edge
      float edge = smoothstep(0.45, 0.5, dist);
      color = mix(color, u_color1, edge * 0.7);

      float alpha = 1.0 - edge;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

const FluidSphere = () => {
  const materialRef = useRef<any>();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
      materialRef.current.u_mouse.x = state.pointer.x * 0.5 + 0.5;
      materialRef.current.u_mouse.y = -state.pointer.y * 0.5 + 0.5;
    }
  });

  return (
    <mesh scale={5}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <fluidMaterial ref={materialRef} />
    </mesh>
  );
};

const Logo = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] cursor-pointer">
      <Canvas>
        <FluidSphere />
      </Canvas>
    </div>
  );
};

export default Logo;
