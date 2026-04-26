import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface PairingScreenProps {
  navigation: any;
}

const PairingScreen: React.FC<PairingScreenProps> = ({navigation}) => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>🔗</Text>
    </View>
    <Text style={styles.title}>Cihaz Eşleştirme</Text>
    <Text style={styles.subtitle}>
      Çocuğunuzun cihazını eşleştirmek için aşağıdaki yöntemlerden birini kullanın.
    </Text>
    <TouchableOpacity
      style={styles.methodCard}
      onPress={() => navigation.navigate('QrGeneration')}>
      <Text style={styles.methodEmoji}>📱</Text>
      <View style={styles.methodInfo}>
        <Text style={styles.methodTitle}>QR Kod ile Eşleştir</Text>
        <Text style={styles.methodDesc}>QR kodu çocuğun cihazından taratın</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.methodCard}>
      <Text style={styles.methodEmoji}>🔢</Text>
      <View style={styles.methodInfo}>
        <Text style={styles.methodTitle}>Kod ile Eşleştir</Text>
        <Text style={styles.methodDesc}>Eşleştirme kodunu çocuğun cihazına girin</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.screenPadding,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.parentPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  icon: {fontSize: 48},
  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.md},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  methodEmoji: {fontSize: 28},
  methodInfo: {flex: 1, marginLeft: Spacing.md},
  methodTitle: {...Typography.cardTitle},
  methodDesc: {...Typography.cardSubtitle},
  arrow: {fontSize: 24, color: Colors.textSecondary},
});

export default PairingScreen;
