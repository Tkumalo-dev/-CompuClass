import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

export const authService = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) throw error;
    
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    await AsyncStorage.removeItem('user');
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getOfflineUser() {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};
