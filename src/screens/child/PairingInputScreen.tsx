import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';
import {authService} from '../../services/authService';

interface PairingInputScreenProps {
  navigation: any;
}

const PairingInputScreen: React.FC<PairingInputScreenProps> = ({navigation}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePair = async () => {
    const cleanCode = code.replace(/\s+/g, '').toUpperCase();
    if (cleanCode.length < 6 || cleanCode.length > 8) {
      Alert.alert('Hata', 'Lütfen geçerli bir eşleştirme kodu girin (6 veya 8 haneli alfanümerik)');
      return;
    }
    
    try {
      setIsLoading(true);

      // Fetch child user details
      const user = await authService.getUser();
      const childName = user?.name || 'Çocuk';

      // Setup platform specifications
      const deviceName = Platform.OS === 'web' ? 'Web Tarayıcı' : 'Mobil Cihaz';
      const deviceIdentifier = Platform.OS === 'web' ? 'web-client-' + Math.floor(Math.random() * 1000) : 'mobile-client';

      const res = await apiClient.post('/pair/verify-code', {
        code: cleanCode,
        name: childName,
        age: 12,
        device_name: deviceName,
        platform: Platform.OS,
        device_identifier: deviceIdentifier,
      });

      if (res.status === 201) {
        Alert.alert(
          'Başarılı 🎉',
          'Cihaz eşleştirmesi başarıyla tamamlandı! Güvenli mod etkinleştirildi.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.replace('ChildDashboard'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Eşleştirme hatası:', error);
      
      let errorMsg = 'Geçersiz eşleştirme kodu veya bağlantı hatası oluştu.';
      if (error.response?.status === 429) {
        errorMsg = error.response?.data?.message || 'Çok fazla hatalı deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      Alert.alert(
        'Eşleştirme Başarısız ❌',
        errorMsg
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔗</Text>
      </View>
      <Text style={styles.title}>Eşleştirme Kodu</Text>
      <Text style={styles.subtitle}>
        Ebeveyn cihazından aldığınız 6 veya 8 haneli alfanümerik eşleştirme kodunu girin.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Eşleştirme kodunu girin"
        placeholderTextColor={Colors.textDisabled}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        maxLength={8}
      />
      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handlePair}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>Eşleştir</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screenPadding,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.childPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {fontSize: 48},
  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.md},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: Colors.childPrimary,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 6,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.childPrimary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {opacity: 0.7},
  buttonText: {...Typography.button},
});

export default PairingInputScreen;
