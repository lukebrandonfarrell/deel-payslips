import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Payslip } from '../types/payslip';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Downloads a payslip file to device storage
 * @param payslip The payslip to download
 * @returns Promise<boolean> Success status
 */
export async function downloadPayslip(payslip: Payslip): Promise<boolean> {
  try {
    const fileUri = payslip.file;
    const filename = `payslip-${payslip.id}.pdf`;
    const sourceFile = new File(fileUri);
    const localFile = new File(Paths.cache, filename);
    
    // Copy to cache directory
    sourceFile.copy(localFile);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return false;
    }

    // Present share sheet (allows saving/downloading)
    await Sharing.shareAsync(localFile.uri, {
      mimeType: 'application/pdf',
    });

    return true;
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', ERROR_MESSAGES.DOWNLOAD_FAILED);
    return false;
  }
}

/**
 * Previews a payslip file using native viewer
 * @param payslip The payslip to preview
 * @returns Promise<boolean> Success status
 */
export async function previewPayslip(payslip: Payslip): Promise<boolean> {
  try {
    const fileUri = payslip.file;
    const filename = `payslip-${payslip.id}.pdf`;
    const sourceFile = new File(fileUri);
    const localFile = new File(Paths.cache, filename);

    // Copy to cache directory
    sourceFile.copy(localFile);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Preview is not available on this device');
      return false;
    }

    // Open with native viewer
    await Sharing.shareAsync(localFile.uri, {
      mimeType: 'application/pdf',
    });

    return true;
  } catch (error) {
    console.error('Preview error:', error);
    Alert.alert('Error', 'Failed to preview payslip');
    return false;
  }
}
