import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const QrGenerationScreen: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.qrPlaceholder}>
      <Text style={styles.qrEmoji}>📱</Text>
      <View style={styles.qrBox}>
        <Text style={styles.qrText}>QR KOD</Text>
      </View>
    </View>
    <Text style={styles.title}>Çocuk Cihazını Eşleştir</Text>
    <Text style={styles.subtitle}>
      Bu QR kodu çocuğunuzun cihazından taratarak eşleştirme işlemini tamamlayın.
    </Text>
    <Text style={styles.hint}>
      Çocuk cihazında "QR Tara" seçeneğini kullanarak bu kodu okutun.
    </Text>
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
  qrPlaceholder: {alignItems: 'center', marginBottom: Spacing.xl},
  qrEmoji: {fontSize: 32, marginBottom: Spacing.md},
  qrBox: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  qrText: {...Typography.headline5, color: Colors.primary},
  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.md},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  hint: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default QrGenerationScreen;
