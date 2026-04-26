import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface QrScannerScreenProps {
  navigation: any;
}

const QrScannerScreen: React.FC<QrScannerScreenProps> = ({navigation}) => (
  <View style={styles.container}>
    <View style={styles.scanArea}>
      <View style={styles.scanBox}>
        <Text style={styles.scanEmoji}>📷</Text>
        <Text style={styles.scanText}>Kamera QR Tarayıcı</Text>
      </View>
    </View>
    <Text style={styles.title}>QR Kod Tara</Text>
    <Text style={styles.subtitle}>
      Ebeveyn cihazındaki QR kodu taratarak eşleştirme işlemini tamamlayın.
    </Text>
    <TouchableOpacity
      style={styles.manualButton}
      onPress={() => navigation.navigate('PairingInput')}>
      <Text style={styles.manualText}>Kodu manuel olarak gir</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screenPadding,
  },
  scanArea: {marginBottom: Spacing.xl},
  scanBox: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: Colors.childPrimary,
    borderRadius: 16,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanEmoji: {fontSize: 48, marginBottom: Spacing.sm},
  scanText: {...Typography.bodyMedium, color: Colors.childPrimary},
  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.md},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  manualButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.childPrimary,
  },
  manualText: {...Typography.bodyMedium, color: Colors.childPrimary, fontWeight: '600'},
});

export default QrScannerScreen;
