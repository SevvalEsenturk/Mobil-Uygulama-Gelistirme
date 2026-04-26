import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const ReportsScreen: React.FC = () => (
  <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerEmoji}>📊</Text>
      <Text style={styles.title}>Raporlar</Text>
      <Text style={styles.subtitle}>Çocuğunuzun cihaz kullanım raporları</Text>
    </View>
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>📅 Haftalık Rapor</Text>
      <Text style={styles.reportDesc}>Bu hafta toplam 15 saat ekran süresi kullanıldı.</Text>
    </View>
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>📈 En Çok Kullanılan</Text>
      <Text style={styles.reportDesc}>Instagram, YouTube ve WhatsApp en çok kullanılan uygulamalar.</Text>
    </View>
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>🚫 Engelleme Logları</Text>
      <Text style={styles.reportDesc}>Bu hafta 5 engelleme denemesi kaydedildi.</Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  header: {alignItems: 'center', marginBottom: Spacing.xl},
  headerEmoji: {fontSize: 48, marginBottom: Spacing.md},
  title: {...Typography.headline3, marginBottom: Spacing.sm},
  subtitle: {...Typography.bodyMedium, color: Colors.textSecondary},
  reportCard: {
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
  reportTitle: {...Typography.cardTitle, marginBottom: Spacing.sm},
  reportDesc: {...Typography.bodyMedium, color: Colors.textSecondary},
});

export default ReportsScreen;
