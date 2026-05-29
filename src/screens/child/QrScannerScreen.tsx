import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Colors, Typography, Spacing} from '../../theme';

interface QrScannerScreenProps {
  navigation: any;
}

const QrScannerScreen: React.FC<QrScannerScreenProps> = ({navigation}) => {
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'loading' | 'granted' | 'denied'>('undetermined');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<any>(null);

  // Request camera permission on mount
  useEffect(() => {
    requestPermission();
    return () => {
      // Clean up stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      try {
        setPermissionStatus('loading');
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {facingMode: 'environment'},
        });
        setStream(mediaStream);
        setPermissionStatus('granted');

        // Delay slightly to ensure video element is mounted in DOM
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(e => console.error('Video oynatılamadı:', e));
          }
        }, 300);
      } catch (err) {
        console.error('Kamera izni hatası:', err);
        setPermissionStatus('denied');
      }
    } else {
      // Native (iOS/Android) simulation
      setPermissionStatus('loading');
      setTimeout(() => {
        Alert.alert(
          'Kamera İzni',
          '"Kilit" uygulaması QR kod tarayabilmek için kamera erişimi istiyor.',
          [
            {
              text: 'Reddet',
              onPress: () => setPermissionStatus('denied'),
              style: 'cancel',
            },
            {
              text: 'İzin Ver',
              onPress: () => setPermissionStatus('granted'),
            },
          ]
        );
      }, 800);
    }
  };

  const handleManualCode = () => {
    // Stop camera stream before navigating away
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigation.navigate('PairingInput');
  };

  // Web camera element rendering
  const renderScannerArea = () => {
    if (permissionStatus === 'loading') {
      return (
        <View style={styles.scanBox}>
          <ActivityIndicator size="large" color={Colors.childPrimary} />
          <Text style={styles.statusText}>Kamera aranıyor...</Text>
        </View>
      );
    }

    if (permissionStatus === 'denied') {
      return (
        <View style={[styles.scanBox, styles.scanBoxError]}>
          <Text style={styles.errorEmoji}>❌</Text>
          <Text style={styles.errorText}>Kamera İzni Reddedildi</Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestPermission}>
            <Text style={styles.retryText}>Tekrar Dene 🔄</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (permissionStatus === 'granted') {
      if (Platform.OS === 'web') {
        return (
          <View style={styles.scanBox}>
            {/* HTML5 video stream rendered inside React Native Web */}
            <video
              ref={videoRef}
              style={styles.webVideo}
              playsInline
              muted
            />
            {/* Pulsing scanning line indicator */}
            <View style={styles.scanLine} />
            <Text style={styles.scanningBadge}>Taranıyor...</Text>
          </View>
        );
      } else {
        // Native Granted simulator
        return (
          <View style={styles.scanBox}>
            <Text style={styles.scanEmoji}>📷</Text>
            <View style={styles.scanLine} />
            <Text style={styles.scanText}>Kamera Aktif (Mobil)</Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.scanBox}>
        <Text style={styles.scanEmoji}>📷</Text>
        <Text style={styles.scanText}>Kamera QR Tarayıcı</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.scanArea}>{renderScannerArea()}</View>

      <Text style={styles.title}>QR Kod Tara</Text>
      <Text style={styles.subtitle}>
        Ebeveyn cihazındaki QR kodu taratarak eşleştirme işlemini tamamlayın.
      </Text>

      <TouchableOpacity style={styles.manualButton} onPress={handleManualCode}>
        <Text style={styles.manualText}>Kodu manuel olarak gir</Text>
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
  scanArea: {
    marginBottom: Spacing.xl,
  },
  scanBox: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: Colors.childPrimary,
    borderRadius: 24,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.surface,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  scanBoxError: {
    borderColor: Colors.error,
    borderStyle: 'solid',
    padding: Spacing.md,
  },
  webVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  scanEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  scanText: {
    ...Typography.bodyMedium,
    color: Colors.childPrimary,
    fontWeight: '600',
  },
  statusText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: Spacing.xs,
  },
  errorText: {
    ...Typography.bodyMedium,
    color: Colors.error,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.error + '15',
  },
  retryText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '700',
  },
  scanningBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
    color: Colors.white,
    ...Typography.caption,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    width: '90%',
    height: 3,
    backgroundColor: Colors.childPrimary,
    borderRadius: 2,
    shadowColor: Colors.childPrimary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    // Custom animation simulation on web
    ...Platform.select({
      web: {
        animationName: 'scanMove',
        animationTimingFunction: 'ease-in-out',
      },
    }),
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
    paddingHorizontal: Spacing.md,
    lineHeight: 20,
  },
  manualButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.childPrimary,
    backgroundColor: Colors.surface,
  },
  manualText: {
    ...Typography.bodyMedium,
    color: Colors.childPrimary,
    fontWeight: '700',
  },
});

// Adding raw global CSS keyframe animation for the scanning line on Web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    @keyframes scanMove {
      0% { top: 10%; }
      50% { top: 90%; }
      100% { top: 10%; }
    }
  `;
  document.getElementsByTagName('head')[0].appendChild(style);
}

export default QrScannerScreen;
