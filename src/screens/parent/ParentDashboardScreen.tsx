import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface ParentDashboardScreenProps {
  navigation: any;
}

const FeatureCard = ({
  title,
  description,
  emoji,
  color,
  onPress,
}: {
  title: string;
  description: string;
  emoji: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress}>
    <View style={[styles.featureIcon, {backgroundColor: color + '15'}]}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const QuickActionButton = ({
  emoji,
  label,
  color,
  onPress,
}: {
  emoji: string;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, {backgroundColor: color + '15'}]}>
      <Text style={styles.quickActionEmoji}>{emoji}</Text>
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({
  navigation,
}) => {
  const handleSync = () => {
    Alert.alert('Senkronizasyon', 'Veriler başarıyla senkronize edildi');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Dashboard Header */}
      <View style={styles.headerIcon}>
        <Text style={styles.headerEmoji}>📊</Text>
      </View>

      <Text style={styles.title}>Ebeveyn Kontrol Paneli</Text>
      <Text style={styles.subtitle}>
        Çocuğunuzun dijital aktivitelerini buradan yönetebilirsiniz.
      </Text>

      {/* Feature Cards */}
      <FeatureCard
        title="Çocuk Cihazı Eşleştir"
        description="QR kod ile çocuk cihazını eşleştirin"
        emoji="📱"
        color={Colors.parentPrimary}
        onPress={() => navigation.navigate('QrGeneration')}
      />

      <FeatureCard
        title="İzinleri Kontrol Et"
        description="Gerekli izinleri kontrol edin ve yönetin"
        emoji="🛡️"
        color={Colors.warning}
        onPress={() => navigation.navigate('Permissions')}
      />

      <FeatureCard
        title="Kullanım İstatistikleri"
        description="Bugünkü uygulama kullanım durumu"
        emoji="📈"
        color={Colors.info}
        onPress={() => navigation.navigate('UsageStatistics')}
      />

      <FeatureCard
        title="Uygulama Kilidi"
        description="Uygulamaları uzaktan kilitleyin"
        emoji="🔒"
        color={Colors.warning}
        onPress={() => navigation.navigate('AppBlocking')}
      />

      <FeatureCard
        title="Zaman Kısıtlamaları"
        description="Uygulama kullanım saatlerini belirleyin"
        emoji="⏰"
        color={Colors.info}
        onPress={() => navigation.navigate('TimeRestriction')}
      />

      {/* Quick Actions */}
      <Text style={styles.quickActionsTitle}>Hızlı Eylemler</Text>
      <View style={styles.quickActionsRow}>
        <QuickActionButton
          emoji="🔄"
          label="Verileri Senkronize Et"
          color={Colors.info}
          onPress={handleSync}
        />
        <QuickActionButton
          emoji="⚙️"
          label="Ayarlar"
          color={Colors.textSecondary}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1, backgroundColor: Colors.background},
  container: {padding: Spacing.screenPadding, paddingBottom: Spacing.xxl},
  headerIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.parentPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  headerEmoji: {fontSize: 48},
  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.md},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  featureCard: {
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureEmoji: {fontSize: 22},
  featureContent: {flex: 1, marginLeft: Spacing.md},
  featureTitle: {...Typography.cardTitle},
  featureDescription: {...Typography.cardSubtitle},
  arrow: {fontSize: 24, color: Colors.textSecondary},
  quickActionsTitle: {
    ...Typography.headlineSmall,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  quickActionsRow: {flexDirection: 'row', gap: Spacing.md},
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionEmoji: {fontSize: 18},
  quickActionLabel: {
    ...Typography.bodySmall,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ParentDashboardScreen;
