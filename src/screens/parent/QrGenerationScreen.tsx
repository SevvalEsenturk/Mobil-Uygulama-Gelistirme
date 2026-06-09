import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';
import apiClient from '../../api/apiClient';

const QrGenerationScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds

  useEffect(() => {
    generateCode();
  }, []);

  // Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const generateCode = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/pair/create-code');
      if (res.data && res.data.code) {
        setCode(res.data.code);
        const expiryMins = res.data.expiryMinutes || 5;
        setTimeLeft(expiryMins * 60);
      }
    } catch (error) {
      console.error('Eşleştirme kodu üretilemedi:', error);
      Alert.alert('Hata', 'Eşleştirme kodu oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <View style={styles.qrPlaceholder}>
            {/* Visual Simulated Premium QR Code */}
            <View style={styles.qrBox}>
              <View style={styles.qrCornerTopLeft} />
              <View style={styles.qrCornerTopRight} />
              <View style={styles.qrCornerBottomLeft} />
              <View style={styles.qrCornerBottomRight} />
              
              {code ? (
                <Image
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${code}` }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <ActivityIndicator size="large" color={Colors.primary} />
              )}
            </View>
          </View>

          <Text style={styles.title}>Çocuk Cihazını Eşleştir</Text>
          
          <Text style={styles.subtitle}>
            Çocuğunuzun cihazındaki kameradan bu alanı taratın veya aşağıdaki 6-8 haneli alfanümerik kodu çocuğunuzun cihazına girin:
          </Text>

          {/* Numerical Code Card */}
          <View style={styles.codeCard}>
            <Text style={styles.codeText}>
              {code.length === 8 
                ? `${code.slice(0, 4)} ${code.slice(4)}` 
                : `${code.slice(0, 3)} ${code.slice(3)}`}
            </Text>
          </View>

          {/* Expiry Counter */}
          <View style={styles.timerRow}>
            <Text style={styles.timerEmoji}>⏰</Text>
            <Text style={[styles.timerText, timeLeft < 60 && styles.timerExpired]}>
              {timeLeft > 0 ? `Kodun geçerlilik süresi: ${formatTime(timeLeft)}` : 'Kodun süresi doldu!'}
            </Text>
          </View>

          {/* Refresh Button */}
          {timeLeft <= 0 && (
            <TouchableOpacity style={styles.refreshBtn} onPress={generateCode}>
              <Text style={styles.refreshText}>Yeni Kod Oluştur 🔄</Text>
            </TouchableOpacity>
          )}
        </>
      )}
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
  qrPlaceholder: {alignItems: 'center', marginBottom: Spacing.xl},
  qrBox: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: Colors.primary + '50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    position: 'relative',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  qrImage: {
    width: 170,
    height: 170,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  qrEmoji: {fontSize: 36, marginBottom: Spacing.xs},
  qrText: {
    ...Typography.headline4,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  qrSubText: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.textDisabled,
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
  },
  // Corner indicators to simulate camera framing on the QR
  qrCornerTopLeft: {position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTopWidth: 4, borderLeftWidth: 4, borderColor: Colors.primary, borderTopLeftRadius: 6},
  qrCornerTopRight: {position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTopWidth: 4, borderRightWidth: 4, borderColor: Colors.primary, borderTopRightRadius: 6},
  qrCornerBottomLeft: {position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: Colors.primary, borderBottomLeftRadius: 6},
  qrCornerBottomRight: {position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottomWidth: 4, borderRightWidth: 4, borderColor: Colors.primary, borderBottomRightRadius: 6},

  title: {...Typography.headline3, textAlign: 'center', marginBottom: Spacing.md},
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    lineHeight: 20,
  },
  codeCard: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  codeText: {
    ...Typography.headline3,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timerEmoji: {fontSize: 16},
  timerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  timerExpired: {
    color: Colors.error,
  },
  refreshBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default QrGenerationScreen;
