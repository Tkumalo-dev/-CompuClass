import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, PanResponder } from 'react-native';
import { WebView } from 'react-native-webview';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';

export default function RealAR() {
  const [loading, setLoading] = useState(true);
  const [useWebView, setUseWebView] = useState(true); // Set to true to test WebView
  const [cameraDistance, setCameraDistance] = useState(5);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const rotationXRef = useRef(0);
  const rotationYRef = useRef(0);
  const autoRotationRef = useRef(0);
  const contextCreatedRef = useRef(false);

  const onContextCreate = async (gl) => {
    if (contextCreatedRef.current) return;
    contextCreatedRef.current = true;
    
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
      const githubUrl = 'https://raw.githubusercontent.com/Tkumalo-dev/-CompuClass/thabo-and-kamo/ARfeature/assets/models/personal_computer.glb';
      const resp = await fetch(githubUrl);

      if (!resp.ok) throw new Error(`Failed to fetch GLB: ${resp.status}`);
      const arrayBuffer = await resp.arrayBuffer();

      const model = await new Promise((resolve, reject) => {
        loader.parse(
          arrayBuffer,
          '',
          (gltf) => resolve(gltf),
          (err) => {
            // Switch to WebView on texture errors
            if (err.toString().includes('texture') || err.toString().includes('Blob')) {
              console.log('🌐 Switching to WebView fallback');
              setUseWebView(true);
              setLoading(false);
            }
            reject(err);
          }
        );
      });

      model.scene.scale.setScalar(3.0);
      model.scene.position.set(0, -0.5, 0);
      modelRef.current = model.scene;
      
      scene.add(model.scene);
      
      console.log('GLB model loaded successfully!');
      
    } catch (error) {
      console.log('🌐 Using WebView fallback');
      setUseWebView(true);
      setLoading(false);
      return;
      
      // Fallback to simple 3D PC-like shape
      const geometry = new THREE.BoxGeometry(2, 1.5, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0x3B82F6 });
      const pcModel = new THREE.Mesh(geometry, material);
      
      // Add a screen
      const screenGeometry = new THREE.PlaneGeometry(1.8, 1.2);
      const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, 0, 0.51);
      
      pcModel.add(screen);
      pcModel.position.set(0, -0.5, 0);
      modelRef.current = pcModel;
      scene.add(pcModel);
    }
    
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
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      rotationYRef.current += gestureState.dx * 0.01;
      rotationXRef.current = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotationXRef.current - gestureState.dy * 0.01));
    },
  });

  if (useWebView) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
          <style>
            body { margin: 0; padding: 0; }
            model-viewer { width: 100%; height: 100vh; background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <model-viewer
            src="https://raw.githubusercontent.com/Tkumalo-dev/-CompuClass/thabo-and-kamo/ARfeature/assets/models/personal_computer.glb"
            alt="Personal Computer 3D Model"
            auto-rotate
            camera-controls
            shadow-intensity="1"
          ></model-viewer>
        </body>
      </html>
    `;
    
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.glView}
        />
        <View style={styles.overlay}>
          <Text style={styles.modelInfo}>Personal Computer - 3D View</Text>
        </View>
      </View>
    );
  }

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