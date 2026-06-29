import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { api } from '../services/api';

const STATUSES = ['', 'planiram', 'poseceno'];

export default function MyVisitsScreen({ navigation }) {
  const [visits, setVisits] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.myVisits(status || undefined);
      setVisits(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VisitDetail', { visitId: item.id })}
    >
      <Text style={styles.name}>{item.destinacija?.naziv}</Text>
      <Text style={styles.meta}>{item.destinacija?.drzava}</Text>
      <View style={styles.row}>
        <Text style={[styles.badge, item.status === 'poseceno' && styles.badgeDone]}>
          {item.status}
        </Text>
        {item.ocena ? <Text style={styles.rating}>Ocena: {item.ocena}/10</Text> : null}
      </View>
      {item.aktivnosti?.length > 0 ? (
        <View style={styles.activitiesBox}>
          <Text style={styles.activitiesTitle}>Aktivnosti</Text>
          {item.aktivnosti.map((a) => (
            <Text key={a.id} style={styles.activityItem}>
              {a.redosled}. {a.naziv}
              {a.opis ? ` — ${a.opis}` : ''}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.noActivities}>Nema unetih aktivnosti</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s || 'all'}
            style={[styles.chip, status === s && styles.chipActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.chipText, status === s && styles.chipTextActive]}>
              {s || 'Sve'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#1a73e8" />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          ListEmptyComponent={<Text style={styles.empty}>Lista je prazna.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e8eef7' },
  chipActive: { backgroundColor: '#1a73e8' },
  chipText: { color: '#333', fontSize: 13, textTransform: 'capitalize' },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '600' },
  meta: { color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  badge: { backgroundColor: '#e8eef7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, textTransform: 'capitalize', color: '#1a73e8' },
  badgeDone: { backgroundColor: '#e6f4ea', color: '#137333' },
  rating: { color: '#f5a623', fontWeight: '500' },
  activitiesBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  activitiesTitle: { fontSize: 13, fontWeight: '600', color: '#1a73e8', marginBottom: 6 },
  activityItem: { fontSize: 13, color: '#444', marginBottom: 4, lineHeight: 18 },
  noActivities: { fontSize: 12, color: '#999', marginTop: 10, fontStyle: 'italic' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
});
