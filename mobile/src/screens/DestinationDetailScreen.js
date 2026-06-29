import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../services/api';

export default function DestinationDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.destination(id);
      setDestination(data);
    } catch (e) {
      Alert.alert('Greška', e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const addToList = async () => {
    setAdding(true);
    try {
      await api.addVisit(id);
      Alert.alert('Uspeh', 'Destinacija dodata na vašu listu (planiram).');
    } catch (e) {
      Alert.alert('Greška', e.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading || !destination) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1a73e8" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{destination.naziv}</Text>
      <Text style={styles.meta}>{destination.drzava} · {destination.kategorija}</Text>
      <Text style={styles.rating}>★ {destination.prosecnaOcena} ({destination.brojOcena} ocena)</Text>
      <Text style={styles.description}>{destination.opis}</Text>

      <TouchableOpacity style={styles.button} onPress={addToList} disabled={adding}>
        <Text style={styles.buttonText}>{adding ? 'Dodavanje...' : 'Dodaj na moju listu'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Moja lista')}
      >
        <Text style={styles.secondaryText}>Pogledaj moju listu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#222' },
  meta: { color: '#666', marginTop: 6, textTransform: 'capitalize' },
  rating: { color: '#f5a623', marginTop: 10, fontSize: 16, fontWeight: '500' },
  description: { marginTop: 20, lineHeight: 22, color: '#444' },
  button: { backgroundColor: '#1a73e8', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: { padding: 16, alignItems: 'center', marginTop: 8 },
  secondaryText: { color: '#1a73e8' },
});
