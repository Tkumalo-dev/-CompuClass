import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import DashboardScreen from './screens/DashboardScreen';
import PCLabScreen from './screens/PCLabScreen';
import QuizScreen from './screens/QuizScreen';
import TroubleshootingScreen from './screens/TroubleshootingScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function CustomHeader({ title, showBadge = false }) {
  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0F2FE',
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
            color: '#1F2937',
          }}>
            CompuClass
          </Text>
          <Text style={{
            fontSize: 12,
            color: '#6B7280',
          }}>
            Computer Learning Platform
          </Text>
        </View>
      </View>
      
      {showBadge && (
        <View style={{
          backgroundColor: '#ECFDF5',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#10B981',
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#10B981',
          }}>
            Student Mode
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#F0FDF4" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'PC Lab') {
              iconName = focused ? 'desktop' : 'desktop-outline';
            } else if (route.name === 'Quiz') {
              iconName = focused ? 'help-circle' : 'help-circle-outline';
            } else if (route.name === 'Troubleshoot') {
              iconName = focused ? 'bug' : 'bug-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          header: ({ route }) => (
            <CustomHeader 
              title={route.name} 
              showBadge={route.name === 'Dashboard'}
            />
          ),
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ 
            title: 'Home',
            tabBarLabel: 'Home'
          }}
        />
        <Tab.Screen 
          name="PC Lab" 
          component={PCLabScreen}
          options={{ 
            title: 'PC Lab',
            tabBarLabel: 'PC Lab',
            headerShown: false
          }}
        />
        <Tab.Screen 
          name="Quiz" 
          component={QuizScreen}
          options={{ 
            title: 'Quiz',
            tabBarLabel: 'Quiz'
          }}
        />
        <Tab.Screen 
          name="Troubleshoot" 
          component={TroubleshootingScreen}
          options={{ 
            title: 'Troubleshoot',
            tabBarLabel: 'Debug'
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: 'Settings',
            tabBarLabel: 'Settings'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}