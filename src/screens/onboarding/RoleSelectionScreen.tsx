import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface RoleSelectionScreenProps {
  navigation: any;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangi rolde kullanacaksınız?</Text>
      <Text style={styles.subtitle}>
        Uygulamanın size özel özelliklerini kullanabilmek için rolünüzü seçin.
      </Text>

      {/* Parent Role Card */}
      <TouchableOpacity
        style={[styles.roleCard, {borderColor: Colors.parentPrimary}]}
        onPress={() => navigation.navigate('Login')}>
        <View
          style={[
            styles.roleIcon,
            {backgroundColor: Colors.parentPrimary + '15'},
          ]}>
          <Text style={styles.roleEmoji}>👨‍💼</Text>
        </View>
        <Text style={styles.roleTitle}>Ebeveyn</Text>
        <Text style={styles.roleDescription}>
          Çocuğunuzun cihazını kontrol edin ve yönetin
        </Text>
      </TouchableOpacity>

      {/* Child Role Card */}
      <TouchableOpacity
        style={[styles.roleCard, {borderColor: Colors.childPrimary}]}
        onPress={() => navigation.navigate('QrScanner')}>
        <View
          style={[
            styles.roleIcon,
            {backgroundColor: Colors.childPrimary + '15'},
          ]}>
          <Text style={styles.roleEmoji}>👧</Text>
        </View>
        <Text style={styles.roleTitle}>Çocuk</Text>
        <Text style={styles.roleDescription}>
          Ebeveyn kontrolü altında güvenli kullanım
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Zaten hesabınız var mı? Giriş Yap
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.screenPadding,
    justifyContent: 'center',
  },
  title: {
    ...Typography.headline3,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roleEmoji: {
    fontSize: 36,
  },
  roleTitle: {
    ...Typography.headline5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  roleDescription: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loginLink: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default RoleSelectionScreen;
