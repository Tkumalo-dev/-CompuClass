import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function Motherboard3D({ style = {} }) {
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

    // Motherboard PCB
    const mbGeometry = new THREE.BoxGeometry(2.5, 0.05, 2.0);
    const mbMaterial = new THREE.MeshPhongMaterial({ color: 0x10B981 });
    const motherboard = new THREE.Mesh(mbGeometry, mbMaterial);

    // CPU socket
    const socketGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.8);
    const socketMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
    const socket = new THREE.Mesh(socketGeometry, socketMaterial);
    socket.position.set(-0.5, 0.05, 0);
    motherboard.add(socket);

    // RAM slots
    for (let i = 0; i < 4; i++) {
      const slotGeometry = new THREE.BoxGeometry(0.1, 0.03, 0.6);
      const slotMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
      const slot = new THREE.Mesh(slotGeometry, slotMaterial);
      slot.position.set(0.3 + i * 0.15, 0.04, 0.5);
      motherboard.add(slot);
    }

    // Capacitors
    for (let i = 0; i < 8; i++) {
      const capGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1);
      const capMaterial = new THREE.MeshPhongMaterial({ color: 0xFCD34D });
      const capacitor = new THREE.Mesh(capGeometry, capMaterial);
      capacitor.position.set(-1 + i * 0.3, 0.05, -0.7);
      motherboard.add(capacitor);
    }

    scene.add(motherboard);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      if (isUnmounted) return;
      try {
        animationId = requestAnimationFrame(animate);
        motherboard.rotation.y += 0.005;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      } catch (error) {
        console.warn('Motherboard3D animation error:', error);
      }
    };
    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
}