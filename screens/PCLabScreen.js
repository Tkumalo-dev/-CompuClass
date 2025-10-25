import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'expo-camera';
import sketchfabService from '../services/echo3dService';

const { width, height } = Dimensions.get('window');

export default function PCLabScreen({ navigation }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [showARView, setShowARView] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [pcModel, setPcModel] = useState(null);

  useEffect(() => {
    loadPCModel();
  }, []);

  const enableCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
    }
  };

  const loadPCModel = async () => {
    try {
      const model = await sketchfabService.getModel();
      setPcModel(model);
    } catch (error) {
      console.error('Failed to load PC model:', error);
    }
  };

  const learningModules = [
    {
      id: 'components',
      title: 'PC Components Overview',
      description: 'Learn about motherboards, CPUs, RAM, storage, and more',
      duration: '15 min',
      difficulty: 'Beginner',
      progress: 80,
      lessons: 8,
      type: 'theory',
      icon: 'hardware-chip',
      color: '#10B981'
    },
    {
      id: 'assembly',
      title: 'Interactive PC Building Lab',
      description: 'Real-time drag & drop PC assembly with guided tutorials',
      duration: '30 min',
      difficulty: 'Intermediate',
      progress: 40,
      lessons: 15,
      type: 'practical',
      icon: 'construct',
      color: '#3B82F6',
      featured: true
    },
    {
      id: 'ar-view',
      title: 'AR PC Components View',
      description: 'View 3D PC components in augmented reality using Sketchfab',
      duration: '20 min',
      difficulty: 'Beginner',
      progress: 0,
      lessons: 5,
      type: 'ar',
      icon: 'camera',
      color: '#F59E0B'
    },
    {
      id: 'troubleshooting',
      title: 'Hardware Troubleshooting',
      description: 'Interactive problem diagnosis and component replacement',
      duration: '25 min',
      difficulty: 'Advanced',
      progress: 30,
      lessons: 12,
      type: 'practical',
      icon: 'bug',
      color: '#EF4444'
    },
    {
      id: 'quiz',
      title: 'Enhanced Knowledge Quiz',
      description: 'Comprehensive quiz covering all PC topics with detailed explanations',
      duration: '15 min',
      difficulty: 'All Levels',
      progress: 0,
      lessons: 25,
      type: 'assessment',
      icon: 'help-circle',
      color: '#8B5CF6'
    }
  ];

  const components = [
    { id: 'motherboard', name: 'Motherboard', icon: 'hardware-chip', installed: false },
    { id: 'cpu', name: 'CPU', icon: 'speedometer', installed: false },
    { id: 'ram', name: 'RAM', icon: 'albums', installed: false },
    { id: 'gpu', name: 'Graphics Card', icon: 'tv', installed: false },
    { id: 'storage', name: 'Storage (SSD)', icon: 'save', installed: false },
    { id: 'psu', name: 'Power Supply', icon: 'battery-charging', installed: false },
  ];

  const steps = [
    'Install Motherboard',
    'Install CPU',
    'Install RAM',
    'Install Graphics Card',
    'Install Storage',
    'Connect Power Supply',
  ];

  const handleModulePress = (moduleId) => {
    if (moduleId === 'assembly') {
      setSelectedModule('assembly');
    } else if (moduleId === 'ar-view') {
      if (hasPermission) {
        setShowARView(true);
      } else {
        Alert.alert('Camera Permission', 'Camera access is required for AR features.');
      }
    } else {
      Alert.alert('Coming Soon', `${learningModules.find(m => m.id === moduleId)?.title} module will be available soon!`);
    }
  };

  const handleComponentPress = (componentId) => {
    if (currentStep < steps.length) {
      const expectedComponent = components[currentStep];
      
      if (componentId === expectedComponent.id) {
        setSelectedComponents([...selectedComponents, componentId]);
        setCurrentStep(currentStep + 1);
        
        if (currentStep === steps.length - 1) {
          Alert.alert(
            'Congratulations! 🎉',
            'You have successfully assembled your PC!',
            [{ text: 'Start New Build', onPress: resetBuild }]
          );
        }
      } else {
        Alert.alert(
          'Wrong Component',
          `Please install the ${expectedComponent.name} first.`
        );
      }
    }
  };

  const resetBuild = () => {
    setSelectedComponents([]);
    setCurrentStep(0);
  };

  const getComponentStatus = (componentId) => {
    return selectedComponents.includes(componentId);
  };

  if (showARView) {
    return (
      <View style={styles.container}>
        {/* AR Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowARView(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#10B981" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AR PC Components</Text>
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          {hasPermission ? (
            <Camera style={styles.camera} type={Camera.Constants.Type.back}>
              <View style={styles.cameraOverlay}>
                <View style={styles.arInfo}>
                  <Ionicons name="scan" size={24} color="#fff" />
                  <Text style={styles.arInfoText}>Point camera at surface to place PC components</Text>
                </View>
                
                {/* AR Controls */}
                <View style={styles.arControls}>
                  <TouchableOpacity style={styles.arButton}>
                    <Ionicons name="desktop" size={20} color="#fff" />
                    <Text style={styles.arButtonText}>PC Case</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.arButton}>
                    <Ionicons name="hardware-chip" size={20} color="#fff" />
                    <Text style={styles.arButtonText}>CPU</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.arButton}>
                    <Ionicons name="albums" size={20} color="#fff" />
                    <Text style={styles.arButtonText}>RAM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Camera>
          ) : (
            <View style={styles.noCamera}>
              <Ionicons name="camera-off" size={48} color="#9CA3AF" />
              <Text style={styles.noCameraText}>Camera access required for AR features</Text>
            </View>
          )}
        </View>

        {/* Component Selection */}
        <View style={styles.componentSelection}>
          <Text style={styles.sectionTitle}>Select Component to View</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.componentList}>
              {components.map((component) => (
                <TouchableOpacity
                  key={component.id}
                  style={styles.componentButton}
                >
                  <Ionicons name={component.icon} size={24} color="#3B82F6" />
                  <Text style={styles.componentButtonText}>{component.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  if (selectedModule === 'assembly') {
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedModule(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#10B981" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Interactive PC Building Lab</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Assembly Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentStep / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          {currentStep < steps.length && (
            <Text style={styles.currentStep}>
              Next: {steps[currentStep]}
            </Text>
          )}
        </View>

        {/* PC Case Visualization */}
        <View style={styles.pcCaseSection}>
          <Text style={styles.sectionTitle}>3D PC Model</Text>
          <View style={styles.pcModel3D}>
            <Ionicons name="desktop" size={width < 400 ? 80 : 120} color="#3B82F6" />
            <Text style={styles.pcModel3DText}>Interactive 3D PC Model</Text>
            <Text style={styles.pcModel3DSubtext}>Explore computer components in 3D</Text>
          </View>
        </View>

        {/* Components Section */}
        <View style={styles.componentsSection}>
          <Text style={styles.sectionTitle}>Available Components</Text>
          <View style={styles.componentsGrid}>
            {components.map((component) => (
              <TouchableOpacity
                key={component.id}
                style={[
                  styles.componentCard,
                  getComponentStatus(component.id) && styles.componentUsed
                ]}
                onPress={() => handleComponentPress(component.id)}
                disabled={getComponentStatus(component.id)}
              >
                <Ionicons 
                  name={component.icon} 
                  size={32} 
                  color={getComponentStatus(component.id) ? '#9CA3AF' : '#3B82F6'} 
                />
                <Text 
                  style={[
                    styles.componentName,
                    getComponentStatus(component.id) && styles.componentUsedText
                  ]}
                >
                  {component.name}
                </Text>
                {getComponentStatus(component.id) && (
                  <View style={styles.installedBadge}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reset Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.resetButton} onPress={resetBuild}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.resetButtonText}>Start New Build</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#10B981" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="desktop" size={20} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Virtual PC Lab</Text>
        </View>
      </View>

      {/* PC Model Section */}
      <View style={styles.pcModelSection}>
        <Text style={styles.pcModelTitle}>3D PC Model</Text>
        <View style={styles.pcModelDisplay}>
          <Ionicons name="desktop" size={100} color="#3B82F6" />
          <Text style={styles.pcModelName}>Personal Computer</Text>
          <Text style={styles.pcModelInfo}>Interactive 3D Model from Sketchfab</Text>
          <TouchableOpacity 
            style={styles.viewModelButton}
            onPress={() => {
              console.log('Loading 3D model...');
              Alert.alert(
                '3D PC Model',
                'Loading interactive 3D model from Sketchfab...',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Open Sketchfab', onPress: () => {
                    const modelUrl = 'https://sketchfab.com/3d-models/personal-computer-aa398650fe6e4baa8771c71266d842f4';
                    Linking.openURL(modelUrl);
                  }}
                ]
              );
            }}
          >
            <Ionicons name="eye" size={20} color="#fff" />
            <Text style={styles.viewModelText}>View in 3D</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Master PC Hardware Through Interactive Learning
        </Text>
        <Text style={styles.heroSubtitle}>
          Build, diagnose, and troubleshoot PCs in a safe virtual environment
        </Text>
      </View>

      {/* Learning Modules */}
      <View style={styles.modulesContainer}>
        {learningModules.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={[
              styles.moduleCard,
              module.featured && styles.featuredModule
            ]}
            onPress={() => handleModulePress(module.id)}
          >
            {module.featured && (
              <LinearGradient
                colors={['#10B981', '#3B82F6']}
                style={styles.featuredBadge}
              >
                <Text style={styles.featuredText}>🎯 Drag & Drop</Text>
              </LinearGradient>
            )}
            
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
                <Ionicons name={module.icon} size={24} color="#fff" />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </View>
            </View>

            <View style={styles.moduleStats}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text style={styles.statText}>{module.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="book" size={16} color="#6B7280" />
                <Text style={styles.statText}>{module.lessons} lessons</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={16} color="#6B7280" />
                <Text style={styles.statText}>{module.difficulty}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercent}>{module.progress}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${module.progress}%`, backgroundColor: module.color }
                  ]} 
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Special Highlight */}
      <LinearGradient
        colors={['#10B981', '#3B82F6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.specialHighlight}
      >
        <View style={styles.highlightIcon}>
          <Ionicons name="construct" size={32} color="#fff" />
        </View>
        <Text style={styles.highlightTitle}>🚀 NEW: Full Drag & Drop PC Assembly!</Text>
        <Text style={styles.highlightSubtitle}>
          Experience the most realistic PC building simulator with true drag-and-drop interaction. 
          Grab components and place them exactly where they belong in the PC case!
        </Text>
        <TouchableOpacity 
          style={styles.highlightButton}
          onPress={() => handleModulePress('assembly')}
        >
          <Ionicons name="play-circle" size={20} color="#10B981" />
          <Text style={styles.highlightButtonText}>Try Interactive Assembly Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    marginLeft: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // PC Model Section Styles
  pcModelSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: width < 400 ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pcModelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  pcModelDisplay: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  pcModelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginTop: 12,
  },
  pcModelInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  viewModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  viewModelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  heroSection: {
    padding: width < 400 ? 12 : 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  heroTitle: {
    fontSize: width < 400 ? 20 : 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: width < 400 ? 26 : 30,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  modulesContainer: {
    padding: 8,
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: width < 400 ? 16 : 20,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  featuredModule: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: width < 400 ? 8 : 0,
    paddingRight: width < 400 ? 80 : 60,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: width < 400 ? 16 : 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: width < 400 ? 20 : 24,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  moduleStats: {
    flexDirection: width < 400 ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: width < 400 ? 8 : 0,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  specialHighlight: {
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  highlightIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  highlightSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  highlightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  highlightButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  // Assembly mode styles
  progressSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  currentStep: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  pcCaseSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  pcCaseContainer: {
    flexDirection: width < 400 ? 'column' : 'row',
    gap: 16,
  },
  pcCase: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width < 400 ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  pcCaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  pcModel3D: {
    backgroundColor: '#F0F9FF',
    padding: width < 400 ? 16 : 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    flex: width < 400 ? 0 : 1,
    marginBottom: width < 400 ? 16 : 0,
  },
  pcModel3DText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginTop: 8,
  },
  pcModel3DSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  installedComponents: {
    gap: 8,
  },
  componentSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  componentInstalled: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  componentSlotText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  componentInstalledText: {
    color: '#10B981',
    fontWeight: '600',
  },
  componentsSection: {
    margin: 16,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  componentCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    minHeight: 100,
  },
  componentUsed: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  componentUsedText: {
    color: '#9CA3AF',
  },
  installedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSection: {
    margin: 16,
    marginBottom: 32,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // AR View Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  arInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
  },
  arInfoText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  arControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  arButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  arButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  noCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  noCameraText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
  },
  componentSelection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 150,
  },
  componentList: {
    flexDirection: 'row',
    gap: 12,
  },
  componentButton: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    minWidth: 80,
  },
  componentButtonText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});