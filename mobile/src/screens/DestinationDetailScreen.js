import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../services/api';
import { getDestinationGallery } from '../data/destinationGalleries';
import GalleryLightbox from '../components/GalleryLightbox';

export default function DestinationDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

  const gallery = getDestinationGallery(destination);

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{destination.naziv}</Text>
        <Text style={styles.meta}>{destination.drzava} · {destination.kategorija}</Text>
        <Text style={styles.rating}>★ {destination.prosecnaOcena} ({destination.brojOcena} ocena)</Text>

        {gallery.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Foto album</Text>
            <Text style={styles.galleryHint}>Klikni na sliku za uvećanje</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryList}
            >
              {gallery.map((source, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.85}
                  onPress={() => setLightboxIndex(index)}
                >
                  <Image source={source} style={styles.galleryImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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

      <GalleryLightbox
        visible={lightboxIndex !== null}
        images={gallery}
        index={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#222' },
  meta: { color: '#666', marginTop: 6, textTransform: 'capitalize' },
  rating: { color: '#f5a623', marginTop: 10, fontSize: 16, fontWeight: '500' },
  gallerySection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#222', marginBottom: 4 },
  galleryHint: { fontSize: 13, color: '#888', marginBottom: 12 },
  galleryList: { paddingRight: 8 },
  galleryImage: {
    width: 240,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#e8eef7',
  },
  description: { marginTop: 20, lineHeight: 22, color: '#444' },
  button: { backgroundColor: '#1a73e8', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: { padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 24 },
  secondaryText: { color: '#1a73e8' },
});
