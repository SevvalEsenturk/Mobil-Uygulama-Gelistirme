import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface PairingInputScreenProps {
  navigation: any;
}

const PairingInputScreen: React.FC<PairingInputScreenProps> = ({navigation}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePair = () => {
    if (code.length < 6) {
      Alert.alert('Hata', 'Lütfen geçerli bir eşleştirme kodu girin');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Başarılı', 'Cihaz eşleştirmesi tamamlandı!', [
        {text: 'Tamam', onPress: () => navigation.replace('ChildDashboard')},
      ]);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔗</Text>
      </View>
      <Text style={styles.title}>Eşleştirme Kodu</Text>
      <Text style={styles.subtitle}>
        Ebeveyn cihazından aldığınız eşleştirme kodunu girin.
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
