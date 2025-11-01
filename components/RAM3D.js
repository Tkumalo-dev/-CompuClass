import React, { useState } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';

export default function RAM3D({ style = {} }) {
  let animationId = null;
  let isUnmounted = false;
  const [loading, setLoading] = useState(true);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.set(2, 1, 2);
    camera.lookAt(0, 0, 0);

    try {
      // Load RAM model from Sketchfab
      const loader = new GLTFLoader();
      const ramUrl = 'https://api.sketchfab.com/v3/models/ab2b1c25c31b44c1a757911734bdf942/download';
      
      const model = await new Promise((resolve, reject) => {
        loader.load(
          ramUrl,
          (gltf) => resolve(gltf),
          undefined,
          (error) => reject(error)
        );
      });
      
      // Scale and position for RAM component view
      model.scene.scale.setScalar(1.0);
      model.scene.position.set(0, 0, 0);
      scene.add(model.scene);
      setLoading(false);

      const animate = () => {
        if (isUnmounted) return;
        try {
          animationId = requestAnimationFrame(animate);
          model.scene.rotation.y += 0.01;
          renderer.render(scene, camera);
          gl.endFrameEXP();
        } catch (error) {
          console.warn('RAM3D animation error:', error);
        }
      };
      animate();
      
    } catch (error) {
      // Fallback: Create simple RAM geometry
      const ramGeometry = new THREE.BoxGeometry(0.8, 0.1, 3.2);
      const ramMaterial = new THREE.MeshPhongMaterial({ color: 0x10B981 });
      const ramStick = new THREE.Mesh(ramGeometry, ramMaterial);

      const chipGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.4);
      const chipMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
      
      for (let i = 0; i < 8; i++) {
        const chip = new THREE.Mesh(chipGeometry, chipMaterial);
        chip.position.set(0, 0.08, -1.4 + i * 0.4);
        ramStick.add(chip);
      }

      scene.add(ramStick);
      setLoading(false);

      const animate = () => {
        if (isUnmounted) return;
        try {
          animationId = requestAnimationFrame(animate);
          ramStick.rotation.y += 0.01;
          renderer.render(scene, camera);
          gl.endFrameEXP();
        } catch (error) {
          console.warn('RAM3D animation error:', error);
        }
      };
      animate();
    }
  };

  return <GLView style={style} onContextCreate={onContextCreate} />;
}