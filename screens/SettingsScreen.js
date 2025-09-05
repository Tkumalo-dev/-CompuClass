import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsOptions = [
    {
      title: 'Profile',
      items: [
        {
          icon: 'person',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          onPress: () => Alert.alert('Profile', 'Profile editing coming soon!'),
        },
        {
          icon: 'trophy',
          title: 'Achievements',
          subtitle: 'View your learning milestones',
          onPress: () => Alert.alert('Achievements', 'Achievements coming soon!'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          title: 'Notifications',
          subtitle: 'Get reminders and updates',
          hasSwitch: true,
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'volume-high',
          title: 'Sound Effects',
          subtitle: 'Enable audio feedback',
          hasSwitch: true,
          value: soundEffects,
          onToggle: setSoundEffects,
        },
        {
          icon: 'moon',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          hasSwitch: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: 'Learning',
      items: [
        {
          icon: 'refresh',
          title: 'Reset Progress',
          subtitle: 'Clear all learning data',
          onPress: () => {
            Alert.alert(
              'Reset Progress',
              'Are you sure you want to reset all your progress? This cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => {} },
              ]
            );
          },
        },
        {
          icon: 'download',
          title: 'Download Content',
          subtitle: 'Save lessons for offline use',
          onPress: () => Alert.alert('Download', 'Offline content coming soon!'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          onPress: () => Alert.alert('Help', 'Help section coming soon!'),
        },
        {
          icon: 'mail',
          title: 'Contact Support',
          subtitle: 'Get help from our team',
          onPress: () => Alert.alert('Support', 'Contact support coming soon!'),
        },
        {
          icon: 'information-circle',
          title: 'About CompuClass',
          subtitle: 'Version 1.0.0',
          onPress: () => {
            Alert.alert(
              'About CompuClass',
              'CompuClass v1.0.0\n\nAn interactive learning platform for computer hardware education.\n\nDeveloped for educational purposes.'
            );
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.hasSwitch}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon} size={20} color="#10B981" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {item.hasSwitch ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }}
            thumbColor={item.value ? '#10B981' : '#F3F4F6'}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.profileName}>Student</Text>
        <Text style={styles.profileEmail}>student@compuclass.edu</Text>
      </View>

      {/* Settings Sections */}
      {settingsOptions.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.settingsGroup}>
            {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          CompuClass - Interactive Computer Learning
        </Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingItemRight: {
    marginLeft: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});