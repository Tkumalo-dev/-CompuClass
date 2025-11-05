import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

export const authService = {
  async signUp(email, password, fullName, role = 'student') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    
    if (error) throw error;
    
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
    return data;
  },

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase signout error:', error);
    }
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('loginTimestamp');
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return { ...user, profile };
    }
    return user;
  },

  async getOfflineUser() {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  async isSessionValid() {
    const timestamp = await AsyncStorage.getItem('loginTimestamp');
    if (!timestamp) return false;
    
    const loginTime = parseInt(timestamp);
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    return (currentTime - loginTime) < thirtyMinutes;
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async updateProfile(fullName, avatarFile = null) {
    const { data: { user } } = await supabase.auth.getUser();
    let avatarUrl = null;

    if (avatarFile) {
      const fileName = `${user.id}/avatar_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      avatarUrl = urlData.publicUrl;
    }

    const updateData = { full_name: fullName };
    if (avatarUrl) updateData.avatar_url = avatarUrl;

    const { data, error } = await supabase.auth.updateUser({
      data: updateData
    });
    if (error) throw error;
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async updatePassword(currentPassword, newPassword) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });
    if (signInError) throw new Error('Current password is incorrect');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },
};
