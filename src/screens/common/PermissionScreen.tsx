import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

const PERMISSIONS = [
  {name: 'Kullanım Erişimi', desc: 'Uygulama kullanım istatistikleri', emoji: '📊', granted: true},
  {name: 'Cihaz Yöneticisi', desc: 'Uygulama kilitleme için gerekli', emoji: '🛡️', granted: false},
  {name: 'Bildirimler', desc: 'Bildirim gönderme izni', emoji: '🔔', granted: true},
  {name: 'Erişilebilirlik', desc: 'Uygulama izleme servisi', emoji: '♿', granted: false},
  {name: 'Arka Plan Çalışma', desc: 'Arka planda çalışma izni', emoji: '⚡', granted: true},
];

const PermissionScreen: React.FC = () => {
  const handleGrant = (name: string) => {
    Alert.alert('İzin', `${name} izni isteniyor...`);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gerekli İzinler</Text>
      <Text style={styles.subtitle}>
        Uygulamanın düzgün çalışması için aşağıdaki izinleri verin.
      </Text>

      {PERMISSIONS.map(perm => (
        <View key={perm.name} style={styles.permItem}>
          <Text style={styles.permEmoji}>{perm.emoji}</Text>
          <View style={styles.permInfo}>
            <Text style={styles.permName}>{perm.name}</Text>
            <Text style={styles.permDesc}>{perm.desc}</Text>
          </View>
          {perm.granted ? (
            <Text style={styles.grantedText}>✅ Verildi</Text>
          ) : (
            <TouchableOpacity
              style={styles.grantButton}
              onPress={() => handleGrant(perm.name)}>
              <Text style={styles.grantButtonText}>İzin Ver</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  title: {...Typography.headline3, marginBottom: Spacing.sm},
  subtitle: {...Typography.bodyMedium, color: Colors.textSecondary, marginBottom: Spacing.xl},
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  permEmoji: {fontSize: 24},
  permInfo: {flex: 1, marginLeft: Spacing.md},
  permName: {...Typography.cardTitle},
  permDesc: {...Typography.cardSubtitle},
  grantedText: {...Typography.bodySmall, color: Colors.success},
  grantButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  grantButtonText: {...Typography.bodySmall, color: Colors.white, fontWeight: '600'},
});

export default PermissionScreen;
