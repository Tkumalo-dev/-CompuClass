import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import DashboardScreen from './screens/DashboardScreen';
import PCLabScreen from './screens/PCLabScreen';
import QuizScreen from './screens/QuizScreen';
import TroubleshootingScreen from './screens/TroubleshootingScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import Windows11SimulatorScreen from './screens/Windows11SimulatorScreen';
import LecturerDashboardScreen from './screens/LecturerDashboardScreen';
import FolderContentScreen from './screens/FolderContentScreen';
import StudentMaterialsScreen from './screens/StudentMaterialsScreen';
import SettingsScreen from './screens/SettingsScreen';
import Sidebar from './components/Sidebar';
import { authService } from './services/authService';
import { supabase } from './config/supabase';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LecturerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LecturerDashboard" component={LecturerDashboardScreen} />
      <Stack.Screen name="FolderContent" component={FolderContentScreen} />
    </Stack.Navigator>
  );
}
const { width } = Dimensions.get('window');

function CustomHeader({ title, showBadge = false, onMenuPress }) {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={theme.headerGradient}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="desktop" size={20} color="#fff" />
        </LinearGradient>
        <View>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.text,
          }}>
            CompuClass
          </Text>
          <Text style={{
            fontSize: 12,
            color: theme.textSecondary,
          }}>
            Computer Learning Platform
          </Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={onMenuPress} style={{ padding: 8 }}>
        <Ionicons name="menu" size={24} color={theme.primary} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigationRef = useRef(null);

  const sidebarTranslateX = useRef(new Animated.Value(-width * 0.8)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 20 && Math.abs(gestureState.dy) < 80,
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.min(0, -width * 0.8 + gestureState.dx);
        sidebarTranslateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          Animated.spring(sidebarTranslateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setSidebarVisible(true);
        } else {
          Animated.spring(sidebarTranslateX, {
            toValue: -width * 0.8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = await authService.getCurrentUser();
        if (user) {
          setUserRole(user.profile?.role || 'student');
          setIsLoggedIn(true);
          setIsFirstLaunch(false);
        }
      } else {
        await authService.signOut();
      }
    } catch (error) {
      await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setIsFirstLaunch(false);
  };

  const handleLogin = async () => {
    const user = await authService.getCurrentUser();
    setUserRole(user?.profile?.role || 'student');
    setIsLoggedIn(true);
  };

  const handleShowSignUp = () => {
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
  };

  const handleSignUpSuccess = async () => {
    const user = await authService.getCurrentUser();
    setUserRole(user?.profile?.role || 'student');
    setShowSignUp(false);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = (screen) => {
    navigationRef.current?.navigate(screen);
  };

  if (loading) {
    return null;
  }

  if (isFirstLaunch) {
    return (
      <>
        <StatusBar style="light" backgroundColor="#0F172A" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  if (!isLoggedIn) {
    if (showSignUp) {
      return (
        <>
          <StatusBar style="light" backgroundColor="#0F172A" />
          <SignUpScreen onSignUp={handleSignUpSuccess} onBackToLogin={handleBackToLogin} />
        </>
      );
    }
    return (
      <>
        <StatusBar style="light" backgroundColor="#0F172A" />
        <LoginScreen onLogin={handleLogin} onSignUp={handleShowSignUp} />
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          <NavigationContainer ref={navigationRef}>
          <StatusBar style="dark" backgroundColor="#F0FDF4" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Dashboard') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Lecturer') {
                iconName = focused ? 'briefcase' : 'briefcase-outline';
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'PC Lab') {
                iconName = focused ? 'desktop' : 'desktop-outline';
              } else if (route.name === 'Windows 11') {
                iconName = focused ? 'laptop' : 'laptop-outline';
              } else if (route.name === 'Quiz') {
                iconName = focused ? 'help-circle' : 'help-circle-outline';
              } else if (route.name === 'Troubleshoot') {
                iconName = focused ? 'bug' : 'bug-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarStyle: {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
            },
            tabBarItemStyle: {
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            tabBarContentContainerStyle: {
              justifyContent: 'space-around',
              width: '100%',
            },
            header: ({ route }) => (
              <CustomHeader 
                title={route.name} 
                showBadge={route.name === 'Dashboard'}
                onMenuPress={() => setSidebarVisible(true)}
              />
            ),
          })}
        >
          {userRole === 'lecturer' ? (
            <Tab.Screen 
              name="Lecturer" 
              component={LecturerStack}
              options={{ 
                title: 'Lecturer',
                tabBarLabel: 'Lecturer'
              }}
            />
          ) : (
            <Tab.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ 
                title: 'Home',
                tabBarLabel: 'Home'
              }}
            />
          )}
          <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ 
              title: 'Search',
              tabBarLabel: 'Search'
            }}
          />
          <Tab.Screen 
            name="Profile" 
            options={{ 
              title: 'Profile',
              tabBarLabel: 'Profile'
            }}
          >
            {() => <ProfileScreen onLogout={handleLogout} />}
          </Tab.Screen>
          <Tab.Screen 
            name="PC Lab" 
            component={PCLabScreen}
            options={{ 
              title: 'PC Lab',
              tabBarButton: () => null,
              headerShown: false
            }}
          />
          <Tab.Screen 
            name="Windows 11" 
            component={Windows11SimulatorScreen}
            options={{ 
              title: 'Windows 11',
              tabBarButton: () => null,
              headerShown: false
            }}
          />
          <Tab.Screen 
            name="Quiz" 
            component={QuizScreen}
            options={{ 
              title: 'Quiz',
              tabBarButton: () => null
            }}
          />
          <Tab.Screen 
            name="Troubleshoot" 
            component={TroubleshootingScreen}
            options={{ 
              title: 'Troubleshoot',
              tabBarButton: () => null
            }}
          />
          <Tab.Screen 
            name="Materials" 
            component={StudentMaterialsScreen}
            options={{ 
              title: 'Materials',
              tabBarButton: () => null
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              title: 'Settings',
              tabBarButton: () => null
            }}
          />
        </Tab.Navigator>
          </NavigationContainer>
          <Sidebar 
            visible={sidebarVisible} 
            onClose={() => setSidebarVisible(false)}
            onNavigate={handleNavigate}
            translateX={sidebarTranslateX}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}