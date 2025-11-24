import { Alert, PermissionsAndroid, Platform } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'never_ask_again';

export interface PermissionResult {
  granted: boolean;
  status: PermissionStatus;
}

/**
 * Checks if Android file write permission is granted
 */
async function checkAndroidFilePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true; // iOS doesn't need this permission
  }

  // Android 13+ (API 33+) uses scoped storage, no permission needed
  if (Platform.Version >= 33) {
    return true;
  }

  // Android 10+ (API 29+) uses scoped storage for most cases
  // But we might still need WRITE_EXTERNAL_STORAGE for some operations
  if (Platform.Version >= 29) {
    // Check if we have permission
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    return granted;
  }

  // Android < 10 needs WRITE_EXTERNAL_STORAGE
  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );
  return granted;
}

/**
 * Requests Android file write permission
 */
export async function requestAndroidFilePermission(): Promise<PermissionResult> {
  if (Platform.OS !== 'android') {
    return { granted: true, status: 'granted' };
  }

  // Android 13+ doesn't need this permission
  if (Platform.Version >= 33) {
    return { granted: true, status: 'granted' };
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'This app needs access to storage to download PDF files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return { granted: true, status: 'granted' };
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return { granted: false, status: 'never_ask_again' };
    } else {
      return { granted: false, status: 'denied' };
    }
  } catch (err) {
    console.error('Permission request error:', err);
    return { granted: false, status: 'denied' };
  }
}

/**
 * Checks and requests file permissions if needed
 * Returns true if permission is granted, false otherwise
 */
export async function checkAndRequestFilePermission(): Promise<boolean> {
  const hasPermission = await checkAndroidFilePermission();
  
  if (hasPermission) {
    return true;
  }

  const result = await requestAndroidFilePermission();
  return result.granted;
}

/**
 * Shows an alert for permission errors
 */
export function showPermissionErrorAlert(status: PermissionStatus): void {
  if (status === 'never_ask_again') {
    Alert.alert(
      'Permission Required',
      'Storage permission is required to download PDF files. Please enable it in your device settings.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  } else {
    Alert.alert(
      'Permission Denied',
      'Storage permission was denied. Please grant permission to download PDF files.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  }
}

