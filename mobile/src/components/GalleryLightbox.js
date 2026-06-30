import React from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function GalleryLightbox({ visible, images, index, onClose, onChangeIndex }) {
  if (!visible || !images.length) {
    return null;
  }

  const goPrev = () => {
    if (index > 0) {
      onChangeIndex(index - 1);
    }
  };

  const goNext = () => {
    if (index < images.length - 1) {
      onChangeIndex(index + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Zatvori">
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>
          {index + 1} / {images.length}
        </Text>

        <View style={styles.imageRow}>
          {index > 0 && (
            <TouchableOpacity style={styles.arrowLeft} onPress={goPrev} accessibilityLabel="Prethodna slika">
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
          )}

          <Image source={images[index]} style={styles.image} resizeMode="contain" />

          {index < images.length - 1 && (
            <TouchableOpacity style={styles.arrowRight} onPress={goNext} accessibilityLabel="Sledeća slika">
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 24,
    right: 20,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  counter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 30,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '500',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  image: {
    width: width - 100,
    height: height * 0.65,
  },
  arrowLeft: {
    position: 'absolute',
    left: 8,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { color: '#fff', fontSize: 32, lineHeight: 36, fontWeight: '300' },
});
