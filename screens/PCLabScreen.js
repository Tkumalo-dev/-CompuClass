import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';


const { width, height } = Dimensions.get('window');

export default function PCLabScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showMotherboardFullscreen, setShowMotherboardFullscreen] = useState(false);
  const [showCPUFullscreen, setShowCPUFullscreen] = useState(false);
  const [showRAMFullscreen, setShowRAMFullscreen] = useState(false);
  const [showGPUFullscreen, setShowGPUFullscreen] = useState(false);
  const [showStorageFullscreen, setShowStorageFullscreen] = useState(false);
  const [showPSUFullscreen, setShowPSUFullscreen] = useState(false);

  const components = [
    { id: 'motherboard', name: 'Motherboard', icon: 'hardware-chip' },
    { id: 'cpu', name: 'CPU', icon: 'speedometer' },
    { id: 'ram', name: 'RAM', icon: 'albums' },
    { id: 'gpu', name: 'Graphics Card', icon: 'tv' },
    { id: 'storage', name: 'Storage (SSD)', icon: 'save' },
    { id: 'psu', name: 'Power Supply', icon: 'battery-charging' },
  ];

  const steps = [
    'Install Motherboard',
    'Install CPU',
    'Install RAM',
    'Install Graphics Card',
    'Install Storage',
    'Connect Power Supply',
  ];

  const handleComponentPress = (componentId) => {
    if (componentId === 'motherboard') {
      setShowMotherboardFullscreen(true);
      return;
    }
    if (componentId === 'cpu') {
      setShowCPUFullscreen(true);
      return;
    }
    if (componentId === 'ram') {
      setShowRAMFullscreen(true);
      return;
    }
    if (componentId === 'gpu') {
      setShowGPUFullscreen(true);
      return;
    }
    if (componentId === 'storage') {
      setShowStorageFullscreen(true);
      return;
    }
    if (componentId === 'psu') {
      setShowPSUFullscreen(true);
      return;
    }
    
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

  if (showMotherboardFullscreen) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedModule(null)}
          >
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
            <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Interactive PC Building Lab</Text>
        </View>

        {/* Progress Section */}
        <View style={[styles.progressSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.progressTitle, { color: theme.text }]}>Assembly Progress</Text>
          <View style={[styles.progressBar, { backgroundColor: theme.borderLight }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentStep / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          {currentStep < steps.length && (
            <Text style={[styles.currentStep, { color: theme.primary }]}>
              Next: {steps[currentStep]}
            </Text>
          )}
        </View>

        {/* PC Case Visualization */}
        <View style={styles.pcCaseSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>PC Case</Text>
          <View style={[styles.pcCase, { backgroundColor: theme.card }]}>
            <Text style={[styles.pcCaseTitle, { color: theme.text }]}>Computer Case</Text>
            <View style={styles.installedComponents}>
              {components.map((component) => (
                <View
                  key={component.id}
                  style={[
                    styles.componentSlot,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    getComponentStatus(component.id) && { backgroundColor: theme.primary + '20', borderColor: theme.primary }
                  ]}
                >
                  <Ionicons 
                    name={component.icon} 
                    size={20} 
                    color={getComponentStatus(component.id) ? '#10B981' : '#D1D5DB'} 
                  />
                  <Text 
                    style={[
                      styles.componentSlotText,
                      { color: theme.textSecondary },
                      getComponentStatus(component.id) && { color: theme.primary, fontWeight: '600' }
                    ]}
                  >
                    {component.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Components Section */}
        <View style={styles.componentsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Components</Text>
          <View style={styles.componentsGrid}>
            {components.map((component) => (
              <TouchableOpacity
                key={component.id}
                style={[
                  styles.componentCard,
                  { backgroundColor: theme.card },
                  getComponentStatus(component.id) && { backgroundColor: theme.surface, opacity: 0.7 }
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
                    { color: theme.text },
                    getComponentStatus(component.id) && { color: theme.textTertiary }
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
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
          <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="desktop" size={20} color="#fff" />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Virtual PC Lab</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: theme.card }]}>
        <Text style={[styles.heroTitle, { color: theme.text }]}>
          Master PC Hardware Through Interactive Learning
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
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
              { backgroundColor: theme.card },
              module.featured && { borderWidth: 2, borderColor: theme.primary }
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
                <Text style={[styles.moduleTitle, { color: theme.text }]}>{module.title}</Text>
                <Text style={[styles.moduleDescription, { color: theme.textSecondary }]}>{module.description}</Text>
              </View>
            </View>

            <View style={styles.moduleStats}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="#6B7280" />
                <Text style={[styles.statText, { color: theme.textSecondary }]}>{module.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="book" size={16} color="#6B7280" />
                <Text style={[styles.statText, { color: theme.textSecondary }]}>{module.lessons} lessons</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={16} color="#6B7280" />
                <Text style={[styles.statText, { color: theme.textSecondary }]}>{module.difficulty}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Progress</Text>
                <Text style={[styles.progressPercent, { color: theme.text }]}>{module.progress}%</Text>
              </View>
              <View style={[styles.progressBarContainer, { backgroundColor: theme.borderLight }]}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${module.progress}%`, backgroundColor: module.color }
                  ]} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.realARContainer}>
          <RealAR />
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

  realARContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
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
  // Fullscreen Styles
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fullscreenButton: {
    padding: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  // Instructions Popup Styles
  instructionsPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  popupContent: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  popupCloseButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 3,
    marginLeft:12
  },
  popupInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginLeft: 12,
    flex: 1,
  },
  fullscreen3D: {
    flex: 1,
  },
});