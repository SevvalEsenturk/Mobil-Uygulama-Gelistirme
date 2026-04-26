import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import {authService} from '../../services/authService';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const handleLogout = () => {
    Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
      {text: 'İptal'},
      {
        text: 'Çıkış',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          navigation.reset({index: 0, routes: [{name: 'Login'}]});
        },
      },
    ]);
  };

  const settings = [
    {emoji: '👤', title: 'Profil', subtitle: 'Hesap bilgilerinizi düzenleyin'},
    {emoji: '🔔', title: 'Bildirimler', subtitle: 'Bildirim tercihlerinizi yönetin', onPress: () => navigation.navigate('Notifications')},
    {emoji: '🔒', title: 'Gizlilik', subtitle: 'Gizlilik ayarlarınızı yönetin'},
    {emoji: '🌐', title: 'Dil', subtitle: 'Uygulama dilini değiştirin'},
    {emoji: 'ℹ️', title: 'Hakkında', subtitle: 'Uygulama bilgileri'},
    {emoji: '📋', title: 'Kullanım Koşulları', subtitle: 'Kullanım koşullarını görüntüleyin'},
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {settings.map(item => (
        <TouchableOpacity key={item.title} style={styles.settingItem} onPress={item.onPress}>
          <Text style={styles.settingEmoji}>{item.emoji}</Text>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding},
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    elevation: 1,
  },
  settingEmoji: {fontSize: 22},
  settingInfo: {flex: 1, marginLeft: Spacing.md},
  settingTitle: {...Typography.cardTitle},
  settingSubtitle: {...Typography.cardSubtitle},
  arrow: {fontSize: 24, color: Colors.textSecondary},
  logoutButton: {
    backgroundColor: Colors.error + '15',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: {...Typography.bodyMedium, color: Colors.error, fontWeight: '600'},
});

export default SettingsScreen;
