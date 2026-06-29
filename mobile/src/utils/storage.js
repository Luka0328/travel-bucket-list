import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export async function getToken() {
  if (isWeb) {
    return localStorage.getItem('token');
  }
  return SecureStore.getItemAsync('token');
}

export async function setToken(token) {
  if (isWeb) {
    localStorage.setItem('token', token);
    return;
  }
  await SecureStore.setItemAsync('token', token);
}

export async function deleteToken() {
  if (isWeb) {
    localStorage.removeItem('token');
    return;
  }
  await SecureStore.deleteItemAsync('token');
}
