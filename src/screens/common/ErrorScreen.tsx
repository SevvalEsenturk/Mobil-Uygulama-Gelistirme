import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface ErrorScreenProps {
  navigation: any;
  route?: {params?: {message?: string}};
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({navigation, route}) => {
  const errorMessage = route?.params?.message || 'Bir hata oluştu';

  return (
    <View style={styles.container}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.title}>Hata!</Text>
      <Text style={styles.message}>{errorMessage}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenPadding,
  },
  errorEmoji: {fontSize: 64, marginBottom: Spacing.lg},
  title: {...Typography.headline2, color: Colors.error, marginBottom: Spacing.md},
  message: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {...Typography.button},
});

export default ErrorScreen;
