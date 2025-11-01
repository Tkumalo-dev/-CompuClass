import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function CPU3D({ style = {} }) {
  let animationId = null;
  let isUnmounted = false;

  React.useEffect(() => {
    return () => {
      isUnmounted = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const onContextCreate = async (gl) => {
    if (!gl || isUnmounted) return;
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0xf0f9ff);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // CPU base
    const cpuGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const cpuMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
    const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);

    // CPU top (heat spreader)
    const topGeometry = new THREE.BoxGeometry(1.0, 0.05, 1.0);
    const topMaterial = new THREE.MeshPhongMaterial({ color: 0x6B7280 });
    const cpuTop = new THREE.Mesh(topGeometry, topMaterial);
    cpuTop.position.y = 0.075;
    cpu.add(cpuTop);

    // Pins
    for (let x = -0.4; x <= 0.4; x += 0.1) {
      for (let z = -0.4; z <= 0.4; z += 0.1) {
        const pinGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1);
        const pinMaterial = new THREE.MeshPhongMaterial({ color: 0xFCD34D });
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.set(x, -0.1, z);
        cpu.add(pin);
      }
    }

    scene.add(cpu);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.set(2, 1, 2);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      if (isUnmounted) return;
      try {
        animationId = requestAnimationFrame(animate);
        cpu.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      } catch (error) {
        console.warn('CPU3D animation error:', error);
      }
    };
    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
}