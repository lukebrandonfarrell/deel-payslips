import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { checkAndRequestFilePermission, requestAndroidFilePermission, showPermissionErrorAlert } from './permissionsService';

interface UseFilePermissionResult {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  requestPermission: () => Promise<boolean>;
  isRequesting: boolean;
}

/**
 * Hook to manage file permission requests with a modal
 */
export function useFilePermission(): UseFilePermissionResult {
  const [showModal, setShowModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    // On iOS, no permission needed
    if (Platform.OS !== 'android') {
      return true;
    }

    setIsRequesting(true);
    try {
      const result = await requestAndroidFilePermission();
      
      if (result.granted) {
        closeModal();
        return true;
      } else {
        // Show error alert
        showPermissionErrorAlert(result.status);
        return false;
      }
    } catch (error) {
      console.error('Permission request error:', error);
      showPermissionErrorAlert('denied');
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [closeModal]);

  return {
    showModal,
    openModal,
    closeModal,
    requestPermission,
    isRequesting,
  };
}

/**
 * Checks if permission is already granted
 * Returns true if permission is granted, false if modal should be shown
 */
export async function checkFilePermission(): Promise<boolean> {
  return await checkAndRequestFilePermission();
}

