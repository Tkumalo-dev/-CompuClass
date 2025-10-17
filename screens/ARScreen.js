import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import WebAR from "../components/WebAR";
import { createRoot } from 'react-dom/client'




const ARScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
      setIsReady(true);
    })();
  }, [permission, requestPermission]);

  if (!isReady) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={styles.loadingText}>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={styles.loadingText}>
          Camera permission is required for AR background.
        </Text>
        <Text style={styles.loadingText}>
          Please enable it in Settings and reload.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
      <WebAR />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b6b3b3ff",
  },
  center: {
    alignItems: "center", 
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ARScreen;
