import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function Storage3D({ style = {} }) {
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

    // SSD case
    const ssdGeometry = new THREE.BoxGeometry(1.5, 0.15, 0.8);
    const ssdMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
    const ssd = new THREE.Mesh(ssdGeometry, ssdMaterial);

    // SSD label
    const labelGeometry = new THREE.BoxGeometry(1.2, 0.01, 0.6);
    const labelMaterial = new THREE.MeshPhongMaterial({ color: 0x3B82F6 });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = 0.08;
    ssd.add(label);

    // Connector
    const connectorGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.4);
    const connectorMaterial = new THREE.MeshPhongMaterial({ color: 0xFCD34D });
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.position.set(-0.8, 0, 0);
    ssd.add(connector);

    scene.add(ssd);

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
        ssd.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      } catch (error) {
        console.warn('Storage3D animation error:', error);
      }
    };
    animate();
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
}