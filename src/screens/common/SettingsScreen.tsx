import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import {authService} from '../../services/authService';

interface SettingsScreenProps {
  navigation: any;
}

interface ModalInfo {
  title: string;
  emoji: string;
  body: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalInfo | null>(null);

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

  const showInfoModal = (title: string, emoji: string, body: string) => {
    setModalContent({title, emoji, body});
    setModalVisible(true);
  };

  const settings = [
    {
      emoji: '👤',
      title: 'Profil',
      subtitle: 'Hesap bilgilerinizi düzenleyin',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      emoji: '🔔',
      title: 'Bildirimler',
      subtitle: 'Bildirim tercihlerinizi yönetin',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      emoji: '🔒',
      title: 'Gizlilik',
      subtitle: 'Gizlilik ayarlarınızı yönetin',
      onPress: () =>
        showInfoModal(
          'Gizlilik Politikası',
          '🔒',
          'Kilit uygulaması, çocuğunuzun güvenliği ve kullanım analizi için UsageStats API aracılığıyla sadece gerekli verileri işler. Tüm verileriniz yerel SQLite veritabanımızda ve API bağlantılarında şifrelenmiş olarak güvenli bir şekilde saklanır ve üçüncü şahıslarla asla paylaşılmaz.'
        ),
    },
    {
      emoji: '🌐',
      title: 'Dil',
      subtitle: 'Uygulama dilini değiştirin',
      onPress: () =>
        showInfoModal(
          'Dil Seçenekleri',
          '🌐',
          'Uygulamamız şu anda sadece Türkçe dil desteği sunmaktadır.\n\nSadece Türkçe desteklenmektedir.'
        ),
    },
    {
      emoji: 'ℹ️',
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      onPress: () =>
        showInfoModal(
          'Uygulama Hakkında',
          'ℹ️',
          'Kilit - Ebeveyn Denetim Uygulaması\n\nBu uygulama, 2025-2026 Bahar dönemi öğrenci projesi kapsamında modern ebeveyn denetim mekanizmalarını araştırmak ve geliştirmek amacıyla hazırlanmış bir projedir.'
        ),
    },
    {
      emoji: '📋',
      title: 'Kullanım Koşulları',
      subtitle: 'Kullanım koşullarını görüntüleyin',
      onPress: () =>
        showInfoModal(
          'Kullanım Koşulları',
          '📋',
          'Bu uygulamayı indiren ve kullanan kullanıcılar, gerekli tüm güvenlik sorumluluklarını tamamen kendi üzerlerine aldıklarını ve uygulamanın sağladığı denetim özelliklerinin kullanımından doğabilecek her türlü doğrudan veya dolaylı yasal sorumluluğun kendilerine (indiren/yükleyen kullanıcıya) ait olduğunu kabul etmiş sayılırlar.'
        ),
    },
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

      {/* Modern, Beautiful Modal Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Text style={styles.modalEmoji}>{modalContent?.emoji}</Text>
              </View>
              <Text style={styles.modalTitle}>{modalContent?.title}</Text>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBody}>{modalContent?.body}</Text>
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    width: '100%',
    paddingBottom: Spacing.sm,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalEmoji: {fontSize: 32},
  modalTitle: {
    ...Typography.headlineSmall,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalScroll: {
    maxHeight: 250,
    width: '100%',
    marginBottom: Spacing.md,
  },
  modalBody: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalCloseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalCloseText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default SettingsScreen;

