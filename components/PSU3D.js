import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function PSU3D({ style = {} }) {
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

    // PSU case
    const psuGeometry = new THREE.BoxGeometry(1.8, 1.0, 1.2);
    const psuMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
    const psu = new THREE.Mesh(psuGeometry, psuMaterial);

    // Fan grill
    const fanGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05);
    const fanMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
    const fan = new THREE.Mesh(fanGeometry, fanMaterial);
    fan.position.set(0, 0.52, 0);
    fan.rotation.x = Math.PI / 2;
    psu.add(fan);

    // Power cables
    for (let i = 0; i < 3; i++) {
      const cableGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5);
      const cableMaterial = new THREE.MeshPhongMaterial({ color: 0xEF4444 });
      const cable = new THREE.Mesh(cableGeometry, cableMaterial);
      cable.position.set(-0.9, 0.2 - i * 0.2, 0.3 - i * 0.2);
      cable.rotation.z = Math.PI / 2;
      psu.add(cable);
    }

    scene.add(psu);

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
        psu.rotation.y += 0.008;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      } catch (error) {
        console.warn('PSU3D animation error:', error);
      }
    };
    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
}