import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { api } from '../services/api';

export default function StatisticsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.statistics();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1a73e8" />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <Text style={styles.title}>Statistika</Text>
      <View style={styles.card}>
        <Text style={styles.value}>{stats?.ukupnoDestinacija ?? 0}</Text>
        <Text style={styles.label}>Destinacija na listi</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.value}>{stats?.planirane ?? 0}</Text>
        <Text style={styles.label}>Planiranih</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.value}>{stats?.posecene ?? 0}</Text>
        <Text style={styles.label}>Posećenih</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.value}>{stats?.ukupnoAktivnosti ?? 0}</Text>
        <Text style={styles.label}>Ukupno aktivnosti</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#222' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 12, alignItems: 'center' },
  value: { fontSize: 36, fontWeight: '700', color: '#1a73e8' },
  label: { color: '#666', marginTop: 8, fontSize: 16 },
});
