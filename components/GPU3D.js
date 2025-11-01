import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function GPU3D({ style = {} }) {
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

    // GPU PCB
    const pcbGeometry = new THREE.BoxGeometry(2.0, 0.1, 0.8);
    const pcbMaterial = new THREE.MeshPhongMaterial({ color: 0x10B981 });
    const gpu = new THREE.Mesh(pcbGeometry, pcbMaterial);

    // GPU chip
    const chipGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
    const chipMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.set(0, 0.1, 0);
    gpu.add(chip);

    // Cooling fans
    const fanGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05);
    const fanMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
    
    const fan1 = new THREE.Mesh(fanGeometry, fanMaterial);
    fan1.position.set(-0.5, 0.15, 0);
    fan1.rotation.x = Math.PI / 2;
    gpu.add(fan1);

    const fan2 = new THREE.Mesh(fanGeometry, fanMaterial);
    fan2.position.set(0.5, 0.15, 0);
    fan2.rotation.x = Math.PI / 2;
    gpu.add(fan2);

    scene.add(gpu);

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
        gpu.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      } catch (error) {
        console.warn('GPU3D animation error:', error);
      }
    };
    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
}