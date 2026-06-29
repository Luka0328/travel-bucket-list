import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const runLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      runLogout();
      return;
    }

    Alert.alert('Odjava', 'Da li zelite da se odjavite?', [
      { text: 'Otkazi', style: 'cancel' },
      { text: 'Odjava', onPress: runLogout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Ime</Text>
        <Text style={styles.value}>{user?.ime}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Odjava</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 },
  label: { color: '#999', fontSize: 13, marginTop: 12 },
  value: { fontSize: 18, color: '#222', marginTop: 4 },
  button: { backgroundColor: '#d93025', borderRadius: 10, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
