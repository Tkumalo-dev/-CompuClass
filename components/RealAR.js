import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RealAR() {
  const [loading, setLoading] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(5);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const rotationXRef = useRef(0);
  const rotationYRef = useRef(0);
  const autoRotationRef = useRef(0);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistance);
    cameraRef.current = camera;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    try {
      const loader = new GLTFLoader();
      const githubUrl = 'https://raw.githubusercontent.com/kbamb/CompuClassv3/thabo-and-kamo/ARfeature/assets/models/personal_computer.glb';
      
      // Check cache first
      const fileUri = FileSystem.documentDirectory + 'personal_computer.glb';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      let modelUrl = fileUri;
      if (!fileInfo.exists) {
        // Download and cache
        await FileSystem.downloadAsync(githubUrl, fileUri);
        await AsyncStorage.setItem('model_cached', 'true');
      }
      
      const model = await new Promise((resolve, reject) => {
        loader.load(
          modelUrl,
          (gltf) => resolve(gltf),
          undefined,
          (error) => reject(error)
        );
      });
      
      model.scene.scale.setScalar(1.0);
      model.scene.position.set(0, -0.5, 0);
      modelRef.current = model.scene;
      
      scene.add(model.scene);
      setLoading(false);

      const animate = () => {
        requestAnimationFrame(animate);
        
        if (modelRef.current) {
          modelRef.current.rotation.x = rotationXRef.current;
          modelRef.current.rotation.y = rotationYRef.current + autoRotationRef.current;
        }
        
        autoRotationRef.current += 0.01;
        
        if (cameraRef.current) {
          cameraRef.current.position.z = cameraDistance;
        }
        
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      
      animate();
      
    } catch (error) {
      console.error('Failed to load GLB model:', error);
      console.error('Error details:', error.message);
      console.error('Asset URI:', asset?.localUri);
      
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
      rotationYRef.current += gestureState.dx * 0.01;
      rotationXRef.current = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotationXRef.current - gestureState.dy * 0.01));
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