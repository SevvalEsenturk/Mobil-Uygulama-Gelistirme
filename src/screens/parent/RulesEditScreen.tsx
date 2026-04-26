import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const RulesEditScreen: React.FC = () => (
  <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
    <Text style={styles.title}>Kural Düzenleme</Text>
    <Text style={styles.subtitle}>Çocuğunuz için uygulanan kuralları düzenleyin</Text>

    {['Ekran süresi limiti', 'Yasaklı içerik filtresi', 'Uygulama yükleme izni', 'Gece modu'].map((rule, i) => (
      <View key={rule} style={styles.ruleCard}>
        <Text style={styles.ruleEmoji}>{['⏱️', '🔞', '📦', '🌙'][i]}</Text>
        <View style={styles.ruleInfo}>
          <Text style={styles.ruleName}>{rule}</Text>
          <Text style={styles.ruleStatus}>Aktif</Text>
        </View>
        <Text style={styles.editIcon}>✏️</Text>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  title: {...Typography.headline3, marginBottom: Spacing.sm},
  subtitle: {...Typography.bodyMedium, color: Colors.textSecondary, marginBottom: Spacing.xl},
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    elevation: 1,
  },
  ruleEmoji: {fontSize: 24},
  ruleInfo: {flex: 1, marginLeft: Spacing.md},
  ruleName: {...Typography.cardTitle},
  ruleStatus: {...Typography.bodySmall, color: Colors.success},
  editIcon: {fontSize: 18},
});

export default RulesEditScreen;
