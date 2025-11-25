import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { AssetSource, Payslip } from '../../types/payslip';

/**
 * Resolves the URI from an asset (require() result)
 */
export async function resolveAssetUri(asset: AssetSource): Promise<string> {
  // If it's already a string URI, return it
  if (typeof asset === 'string') {
    if (!asset) {
      throw new Error('Asset URI is an empty string');
    }
    return asset;
  }
  
  // If it's an object with a uri property, return that
  if (asset && typeof asset === 'object') {
    if ('uri' in asset && asset.uri) {
      return asset.uri;
    }
    // Check for other possible URI properties
    if ('localUri' in asset && asset.localUri) {
      return asset.localUri;
    }
  }
  
  // If it's a number (asset ID), resolve it using Asset.fromModule
  if (typeof asset === 'number') {
    const assetModule = Asset.fromModule(asset);
    // Download the asset if needed (for remote assets)
    await assetModule.downloadAsync();
    return assetModule.localUri || assetModule.uri;
  }
  
  throw new Error(`Invalid asset format: ${typeof asset}. Expected string, number (asset ID), or object with uri property.`);
}

/**
 * Gets the expected file path for a downloaded payslip
 * @param payslipId The payslip ID
 * @returns The file path
 */
export function getDownloadedPayslipPath(payslipId: string): string {
  const filename = `payslip-${payslipId}.pdf`;
  const localFile = new File(Paths.document, filename);
  return localFile.uri;
}

/**
 * Checks if a payslip has been downloaded
 * @param payslipId The payslip ID
 * @returns Promise<boolean> True if the payslip is downloaded
 */
export async function isPayslipDownloaded(payslipId: string): Promise<boolean> {
  try {
    const filename = `payslip-${payslipId}.pdf`;
    const localFile = new File(Paths.document, filename);
    return localFile.exists;
  } catch (error) {
    console.error('Error checking downloaded payslip:', error);
    return false;
  }
}

/**
 * Downloads a payslip file to device storage
 * @param payslip The payslip to download
 * @returns Promise<boolean> Success status
 */
export async function downloadPayslip(payslip: Payslip): Promise<boolean> {
  try {
    if (!payslip.file) {
      Alert.alert('Error', 'Payslip file not found');
      return false;
    }

    const fileUri = await resolveAssetUri(payslip.file);
    
    if (!fileUri || typeof fileUri !== 'string') {
      throw new Error(`Invalid file URI: ${fileUri}`);
    }

    const filename = `payslip-${payslip.id}.pdf`;
    const sourceFile = new File(fileUri);
    // Use document directory for permanent storage
    const localFile = new File(Paths.document, filename);
    
    // Copy to documents directory
    if (localFile.exists) {
      localFile.delete(); // Replace existing file
    }
    sourceFile.copy(localFile);

    // Inform user of saved location
    Alert.alert(
      'Download Complete',
      `Payslip saved to:\n${localFile.uri}`,
      [{ text: 'OK' }]
    );

    return true;
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', 'Failed to download payslip. Please try again.');
    return false;
  }
}

/**
 * Opens a downloaded payslip file
 * @param payslipId The payslip ID
 * @returns Promise<boolean> Success status
 */
export async function openDownloadedPayslip(payslipId: string): Promise<boolean> {
  try {
    const filePath = getDownloadedPayslipPath(payslipId);
    const localFile = new File(filePath);
    
    if (!localFile.exists) {
      Alert.alert('Error', 'Downloaded file not found');
      return false;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'File opening is not available on this device');
      return false;
    }

    await Sharing.shareAsync(localFile.uri, {
      mimeType: 'application/pdf',
    });

    return true;
  } catch (error) {
    console.error('Error opening downloaded payslip:', error);
    Alert.alert('Error', 'Failed to open downloaded file');
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
    if (!payslip.file) {
      Alert.alert('Error', 'Payslip file not found');
      return false;
    }

    const fileUri = await resolveAssetUri(payslip.file);
    
    if (!fileUri || typeof fileUri !== 'string') {
      throw new Error(`Invalid file URI: ${fileUri}`);
    }

    const filename = `payslip-${payslip.id}.pdf`;
    const sourceFile = new File(fileUri);
    const localFile = new File(Paths.cache, filename);

    // Copy to cache directory only if it doesn't already exist
    if (!localFile.exists) {
      try {
        sourceFile.copy(localFile);
      } catch (copyError: unknown) {
        // If copy fails because file already exists, that's okay - we'll use the existing file
        const errorMessage = copyError instanceof Error ? copyError.message : String(copyError);
        if (errorMessage.includes('already exists') || errorMessage.includes('same name')) {
          // File already exists, which is fine - we'll use it
          console.log('File already exists, using existing file');
        } else {
          // Some other error occurred
          throw copyError;
        }
      }
    }

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
