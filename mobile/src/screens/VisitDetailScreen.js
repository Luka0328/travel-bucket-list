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
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState('');
  const [pendingDeleteActivityId, setPendingDeleteActivityId] = useState(null);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editActivityName, setEditActivityName] = useState('');
  const [editActivityDesc, setEditActivityDesc] = useState('');
  const [savingActivityId, setSavingActivityId] = useState(null);
  const [activityError, setActivityError] = useState('');
  const scrollRef = useRef(null);

  const scrollToInput = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const load = useCallback(async () => {
    try {
      const visits = await api.myVisits();
      const current = visits.find((v) => Number(v.id) === Number(visitId));
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

  const confirmRemove = async () => {
    setRemoving(true);
    setRemoveError('');
    try {
      await api.deleteVisit(visitId);
      navigation.goBack();
    } catch (e) {
      setRemoveError(e.message || 'Uklanjanje nije uspelo.');
      setShowRemoveConfirm(false);
    } finally {
      setRemoving(false);
    }
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

  const startEditActivity = (activity) => {
    setPendingDeleteActivityId(null);
    setActivityError('');
    setEditingActivityId(activity.id);
    setEditActivityName(activity.naziv);
    setEditActivityDesc(activity.opis || '');
  };

  const cancelEditActivity = () => {
    setEditingActivityId(null);
    setEditActivityName('');
    setEditActivityDesc('');
  };

  const saveActivity = async (id) => {
    if (!editActivityName.trim()) {
      setActivityError('Naziv aktivnosti je obavezan.');
      return;
    }
    setSavingActivityId(id);
    setActivityError('');
    try {
      await api.updateActivity(id, { naziv: editActivityName.trim(), opis: editActivityDesc });
      cancelEditActivity();
      load();
    } catch (e) {
      setActivityError(e.message || 'Čuvanje nije uspelo.');
    } finally {
      setSavingActivityId(null);
    }
  };

  const confirmDeleteActivity = async (id) => {
    setDeletingActivityId(id);
    setActivityError('');
    try {
      await api.deleteActivity(id);
      setPendingDeleteActivityId(null);
      if (editingActivityId === id) {
        cancelEditActivity();
      }
      load();
    } catch (e) {
      setActivityError(e.message || 'Brisanje nije uspelo.');
      setPendingDeleteActivityId(null);
    } finally {
      setDeletingActivityId(null);
    }
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
          {editingActivityId === a.id ? (
            <>
              <Text style={styles.activityEditLabel}>Izmena aktivnosti</Text>
              <TextInput
                style={styles.input}
                value={editActivityName}
                onChangeText={setEditActivityName}
                placeholder="Naziv aktivnosti"
                onFocus={scrollToInput}
              />
              <TextInput
                style={styles.input}
                value={editActivityDesc}
                onChangeText={setEditActivityDesc}
                placeholder="Opis aktivnosti"
                multiline
                onFocus={scrollToInput}
              />
              <View style={styles.activityActions}>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => saveActivity(a.id)}
                  disabled={savingActivityId === a.id}
                >
                  {savingActivityId === a.id ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.smallButtonText}>Sačuvaj</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionLink} onPress={cancelEditActivity}>
                  <Text style={styles.secondaryText}>Otkaži</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : pendingDeleteActivityId === a.id ? (
            <>
              <Text style={styles.confirmText}>Obriši aktivnost „{a.naziv}"?</Text>
              <View style={styles.activityActions}>
                <TouchableOpacity
                  style={styles.dangerButtonSmall}
                  onPress={() => confirmDeleteActivity(a.id)}
                  disabled={deletingActivityId === a.id}
                >
                  {deletingActivityId === a.id ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.smallButtonText}>Da, obriši</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionLink}
                  onPress={() => setPendingDeleteActivityId(null)}
                  disabled={deletingActivityId === a.id}
                >
                  <Text style={styles.secondaryText}>Otkaži</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.activityName}>{a.redosled}. {a.naziv}</Text>
              {a.opis ? <Text style={styles.activityDesc}>{a.opis}</Text> : null}
              <View style={styles.activityActions}>
                <TouchableOpacity onPress={() => startEditActivity(a)}>
                  <Text style={styles.editText}>Izmeni</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    cancelEditActivity();
                    setPendingDeleteActivityId(a.id);
                    setActivityError('');
                  }}
                >
                  <Text style={styles.deleteText}>Obriši</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ))}
      {activityError ? <Text style={styles.activityError}>{activityError}</Text> : null}

      <TextInput style={styles.input} value={newActivityName} onChangeText={setNewActivityName} placeholder="Naziv aktivnosti" onFocus={scrollToInput} />
      <TextInput style={styles.input} value={newActivityDesc} onChangeText={setNewActivityDesc} placeholder="Opis aktivnosti" multiline onFocus={scrollToInput} />
      <TouchableOpacity style={styles.secondaryButton} onPress={addActivity}>
        <Text style={styles.secondaryText}>Dodaj aktivnost</Text>
      </TouchableOpacity>

      {showRemoveConfirm ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>Da li ste sigurni da želite da uklonite destinaciju sa liste?</Text>
          <TouchableOpacity style={styles.dangerButtonFilled} onPress={confirmRemove} disabled={removing}>
            {removing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Da, ukloni</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowRemoveConfirm(false)}
            disabled={removing}
          >
            <Text style={styles.secondaryText}>Otkaži</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.dangerButton} onPress={() => setShowRemoveConfirm(true)}>
          <Text style={styles.dangerText}>Ukloni sa liste</Text>
        </TouchableOpacity>
      )}
      {removeError ? <Text style={styles.error}>{removeError}</Text> : null}
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
  activityEditLabel: { fontWeight: '600', marginBottom: 8, color: '#1a73e8' },
  activityName: { fontWeight: '600' },
  activityDesc: { color: '#666', marginTop: 4 },
  activityActions: { flexDirection: 'row', gap: 20, marginTop: 10, alignItems: 'center' },
  actionLink: { paddingVertical: 4 },
  editText: { color: '#1a73e8', fontWeight: '600' },
  deleteText: { color: '#d93025', fontWeight: '600' },
  smallButton: { backgroundColor: '#1a73e8', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, minWidth: 90, alignItems: 'center' },
  dangerButtonSmall: { backgroundColor: '#d93025', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, minWidth: 90, alignItems: 'center' },
  smallButtonText: { color: '#fff', fontWeight: '600' },
  activityError: { color: '#d93025', marginBottom: 8 },
  dangerButton: { marginTop: 30, padding: 14, alignItems: 'center' },
  dangerButtonFilled: { backgroundColor: '#d93025', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  dangerText: { color: '#d93025', fontWeight: '600' },
  confirmBox: { marginTop: 30, marginBottom: 20, padding: 16, backgroundColor: '#fdecea', borderRadius: 10 },
  confirmText: { color: '#333', marginBottom: 8, lineHeight: 20 },
  error: { color: '#d93025', textAlign: 'center', marginBottom: 40, marginTop: 8 },
});
