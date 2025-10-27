import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export default function RealAR() {
  const [loading, setLoading] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(5);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    // Create renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistance);
    cameraRef.current = camera;

    // Create scene
    const scene = new THREE.Scene();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    try {
      // Load your personal computer GLB model
      const loader = new GLTFLoader();
      const glbUrl = 'https://drive.google.com/uc?export=download&id=1iIlf5QJNhljHqSUNFXvGPvwSzKa_7ryd';
      
      const model = await new Promise((resolve, reject) => {
        loader.load(
          glbUrl,
          (gltf) => resolve(gltf),
          undefined,
          (error) => reject(error)
        );
      });
      
      // Scale and position the model (much larger)
      model.scene.scale.setScalar(2.0);
      model.scene.position.set(0, -0.5, 0);
      modelRef.current = model.scene;
      
      scene.add(model.scene);
      console.log('GLB model loaded successfully');
      setLoading(false);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Apply user rotations
        if (modelRef.current) {
          modelRef.current.rotation.x = rotationX;
          modelRef.current.rotation.y = rotationY + Date.now() * 0.001;
        }
        
        // Update camera distance
        if (cameraRef.current) {
          cameraRef.current.position.z = cameraDistance;
        }
        
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      
      animate();
      
    } catch (error) {
      console.error('Failed to load GLB model:', error);
      
      // Fallback: Create simple geometry
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial({ color: 0x3B82F6 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      
      setLoading(false);

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      
      animate();
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setRotationY(rotationY + gestureState.dx * 0.01);
      setRotationX(Math.max(-Math.PI/2, Math.min(Math.PI/2, rotationX - gestureState.dy * 0.01)));
    },
  });

  return (
    <View style={styles.container}>
      <View {...panResponder.panHandlers} style={styles.glView}>
        <GLView
          style={styles.glView}
          onContextCreate={onContextCreate}
        />
      </View>
      <View style={styles.overlay}>
        <Text style={styles.modelInfo}>
          {loading ? 'Loading 3D PC Model...' : 'Personal Computer - AR View'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    padding: 15,
    borderRadius: 10,
  },
  modelInfo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});