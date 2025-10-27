import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import sketchfabService from '../services/echo3dService';

export default function ARScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupAR();
  }, []);

  const setupAR = async () => {
    // Get camera permission
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');

    // Fetch PC model from Sketchfab
    try {
      const model = await sketchfabService.getModel();
      const downloadInfo = await sketchfabService.getModelDownload();
      
      // Download GLB file locally
      if (downloadInfo.gltf && downloadInfo.gltf.url) {
        const fileUri = FileSystem.documentDirectory + 'pc_model.glb';
        const downloadResult = await FileSystem.downloadAsync(
          downloadInfo.gltf.url,
          fileUri
        );
        
        setModelData({
          ...model,
          localUri: downloadResult.uri
        });
      }
    } catch (error) {
      console.error('Failed to load PC model:', error);
      Alert.alert('Error', 'Failed to load 3D PC model');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading 3D PC Model...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera access required for AR</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back}>
        <View style={styles.overlay}>
          <View style={styles.arPlaceholder}>
            <Text style={styles.arText}>🖥️</Text>
            <Text style={styles.arLabel}>PC Model Here</Text>
            <Text style={styles.arInstructions}>
              Point camera at flat surface
            </Text>
          </View>
          
          {modelData && (
            <View style={styles.modelInfo}>
              <Text style={styles.modelName}>{modelData.name}</Text>
              <Text style={styles.modelReady}>3D Model Ready</Text>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  arPlaceholder: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  arText: {
    fontSize: 60,
  },
  arLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  arInstructions: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  modelInfo: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modelName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modelReady: {
    color: '#10B981',
    fontSize: 14,
    marginTop: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});