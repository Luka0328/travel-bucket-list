import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { api } from '../services/api';

export default function VisitDetailScreen({ route, navigation }) {
  const { visitId } = route.params;
  const [visit, setVisit] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ocena, setOcena] = useState('');
  const [datumPutovanja, setDatumPutovanja] = useState('');
  const [napomena, setNapomena] = useState('');
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const scrollRef = useRef(null);

  const scrollToInput = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const load = useCallback(async () => {
    try {
      const visits = await api.myVisits();
      const current = visits.find((v) => v.id === visitId);
      setVisit(current);
      if (current) {
        setOcena(current.ocena ? String(current.ocena) : '');
        setDatumPutovanja(current.datumPutovanja || '');
        setNapomena(current.napomena || '');
      }
      const acts = await api.activities(visitId);
      setActivities(acts);
    } catch (e) {
      Alert.alert('Greška', e.message);
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    load();
  }, [load]);

  const markVisited = async () => {
    try {
      await api.updateVisit(visitId, {
        status: 'poseceno',
        datum_putovanja: datumPutovanja || new Date().toISOString().split('T')[0],
      });
      Alert.alert('Uspeh', 'Označeno kao posećeno.');
      load();
    } catch (e) {
      Alert.alert('Greška', e.message);
    }
  };

  const saveRating = async () => {
    const rating = parseInt(ocena, 10);
    if (rating < 1 || rating > 10) {
      Alert.alert('Greška', 'Ocena mora biti od 1 do 10.');
      return;
    }
    try {
      await api.updateVisit(visitId, { ocena: rating, napomena });
      Alert.alert('Uspeh', 'Ocena sačuvana.');
      load();
    } catch (e) {
      Alert.alert('Greška', e.message);
    }
  };

  const removeFromList = () => {
    Alert.alert('Ukloni sa liste', 'Da li ste sigurni?', [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Ukloni',
        style: 'destructive',
        onPress: async () => {
          await api.deleteVisit(visitId);
          navigation.goBack();
        },
      },
    ]);
  };

  const addActivity = async () => {
    if (!newActivityName.trim()) return;
    try {
      await api.addActivity(visitId, { naziv: newActivityName, opis: newActivityDesc });
      setNewActivityName('');
      setNewActivityDesc('');
      load();
    } catch (e) {
      Alert.alert('Greška', e.message);
    }
  };

  const deleteActivity = (id) => {
    Alert.alert('Obriši aktivnost', 'Da li ste sigurni?', [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: async () => {
          await api.deleteActivity(id);
          load();
        },
      },
    ]);
  };

  if (loading || !visit) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1a73e8" />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
      <Text style={styles.title}>{visit.destinacija?.naziv}</Text>
      <Text style={styles.meta}>Status: {visit.status}</Text>

      {visit.status === 'planiram' && (
        <TouchableOpacity style={styles.button} onPress={markVisited}>
          <Text style={styles.buttonText}>Označi kao posećeno</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.section}>Ocena (1-10)</Text>
      <TextInput style={styles.input} value={ocena} onChangeText={setOcena} keyboardType="number-pad" placeholder="Ocena" />
      <TextInput style={styles.input} value={datumPutovanja} onChangeText={setDatumPutovanja} placeholder="Datum posete (YYYY-MM-DD)" />
      <TextInput style={styles.input} value={napomena} onChangeText={setNapomena} placeholder="Napomena" multiline onFocus={scrollToInput} />
      <TouchableOpacity style={styles.button} onPress={saveRating}>
        <Text style={styles.buttonText}>Sačuvaj ocenu</Text>
      </TouchableOpacity>

      <Text style={styles.section}>Aktivnosti</Text>
      {activities.map((a) => (
        <View key={a.id} style={styles.activityCard}>
          <Text style={styles.activityName}>{a.redosled}. {a.naziv}</Text>
          {a.opis ? <Text style={styles.activityDesc}>{a.opis}</Text> : null}
          <TouchableOpacity onPress={() => deleteActivity(a.id)}>
            <Text style={styles.deleteText}>Obriši</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TextInput style={styles.input} value={newActivityName} onChangeText={setNewActivityName} placeholder="Naziv aktivnosti" onFocus={scrollToInput} />
      <TextInput style={styles.input} value={newActivityDesc} onChangeText={setNewActivityDesc} placeholder="Opis aktivnosti" multiline onFocus={scrollToInput} />
      <TouchableOpacity style={styles.secondaryButton} onPress={addActivity}>
        <Text style={styles.secondaryText}>Dodaj aktivnost</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={removeFromList}>
        <Text style={styles.dangerText}>Ukloni sa liste</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 160 },
  title: { fontSize: 24, fontWeight: '700' },
  meta: { color: '#666', marginTop: 6, textTransform: 'capitalize' },
  section: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  input: { backgroundColor: '#f5f7fb', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#1a73e8', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  secondaryButton: { padding: 14, alignItems: 'center' },
  secondaryText: { color: '#1a73e8', fontWeight: '600' },
  activityCard: { backgroundColor: '#f5f7fb', padding: 12, borderRadius: 10, marginBottom: 8 },
  activityName: { fontWeight: '600' },
  activityDesc: { color: '#666', marginTop: 4 },
  deleteText: { color: '#d93025', marginTop: 8 },
  dangerButton: { marginTop: 30, marginBottom: 40, padding: 14, alignItems: 'center' },
  dangerText: { color: '#d93025', fontWeight: '600' },
});
