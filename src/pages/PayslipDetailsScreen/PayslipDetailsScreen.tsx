import { Button } from '@tamagui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Text, YStack } from 'tamagui';
import { Badge } from '../../components/Badge/Badge';
import { PermissionModal } from '../../components/PermissionModal/PermissionModal';
import { downloadPayslip, isPayslipDownloaded, openDownloadedPayslip } from '../../services/fileService/fileService';
import { fetchPayslipById } from '../../services/payslipService/payslipService';
import { checkFilePermission, useFilePermission } from '../../services/permissionsService/useFilePermission';
import { formatDate } from '../../utils/dateFormatter';

interface PayslipDetailsScreenProps {
  payslipId: string;
}

export function PayslipDetailsScreen({ payslipId }: PayslipDetailsScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { showModal, openModal, closeModal, requestPermission } = useFilePermission();

  // Use TanStack Query directly
  const { data: payslip, isLoading, error } = useQuery({
    queryKey: ['payslip', payslipId],
    queryFn: () => fetchPayslipById(payslipId),
    enabled: !!payslipId,
  });

  // Check if payslip is already downloaded
  const { data: isDownloaded } = useQuery({
    queryKey: ['payslip-downloaded', payslipId],
    queryFn: () => isPayslipDownloaded(payslipId),
    enabled: !!payslipId,
  });

  const handleDownloadOrOpen = async () => {
    if (!payslip) return;

    // If already downloaded, open it
    if (isDownloaded) {
      await openDownloadedPayslip(payslipId);
      return;
    }

    // Otherwise, download it
    // Check permissions first (only on Android)
    if (Platform.OS === 'android') {
      const hasPermission = await checkFilePermission();
      if (!hasPermission) {
        // Show permission modal
        openModal();
        return;
      }
    }

    // Proceed with download
    setDownloading(true);
    const success = await downloadPayslip(payslip);
    if (success) {
      // Invalidate the download status query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['payslip-downloaded', payslipId] });
    }
    setDownloading(false);
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted && payslip) {
      // Permission granted, proceed with download
      setDownloading(true);
      const success = await downloadPayslip(payslip);
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['payslip-downloaded', payslipId] });
      }
      setDownloading(false);
    }
  };

  const handlePreview = () => {
    router.push(`/${payslipId}/preview`);
  };

  if (isLoading) {
    return (
      <YStack 
        flex={1} 
        alignItems="center" 
        justifyContent="center" 
        backgroundColor="$background"
        paddingTop={insets.top}
        paddingBottom={insets.bottom}
        paddingLeft={insets.left}
        paddingRight={insets.right}
      >
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (error || !payslip) {
    return (
      <YStack 
        flex={1} 
        alignItems="center" 
        justifyContent="center" 
        padding="$4" 
        backgroundColor="$background"
        paddingTop={insets.top}
        paddingBottom={insets.bottom}
        paddingLeft={insets.left}
        paddingRight={insets.right}
      >
        <Text fontSize="$6" marginBottom="$2">Payslip Not Found</Text>
        <Text fontSize="$4" color="$color10" textAlign="center">
          The requested payslip could not be found.
        </Text>
      </YStack>
    );
  }

  return (
    <YStack 
      flex={1} 
      backgroundColor="$background"
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 16 }}>
        <Card elevate size="$4" bordered marginBottom="$4" padding="$4">
          <YStack gap="$4">
            <YStack gap="$4" paddingTop="$2">
              {/* ID */}
              <YStack>
                <Text fontSize="$3" color="$color10" marginBottom="$1">ID</Text>
                <Text fontSize="$4" fontWeight="500">
                  {payslip.id}
                </Text>
              </YStack>

              {/* Period */}
              <YStack>
                <Text fontSize="$3" color="$color10" marginBottom="$1">Period</Text>
                <Text fontSize="$4">
                  {formatDate(payslip.fromDate)} - {formatDate(payslip.toDate)}
                </Text>
              </YStack>

              {/* File Type */}
              <YStack>
                <Text fontSize="$3" color="$color10" marginBottom="$2">File Type</Text>
                <Badge.Provider variant="secondary">
                  <Badge.Frame>
                    <Badge.Label>{payslip.fileType.toUpperCase()}</Badge.Label>
                  </Badge.Frame>
                </Badge.Provider>
              </YStack>
            </YStack>
          </YStack>
        </Card>
      </ScrollView>

      {/* Actions - Fixed at bottom */}
      <YStack 
        gap="$3" 
        padding="$4" 
        backgroundColor="$background" 
        borderTopWidth={1} 
        borderTopColor="$borderColor"
        paddingBottom={insets.bottom}
      >
        <Button
          theme="yellow"
          onPress={handleDownloadOrOpen}
          disabled={downloading}
          width="100%"
          accessibilityLabel={isDownloaded ? "Open payslip" : "Download payslip to device"}
          accessibilityHint={isDownloaded ? "Opens the downloaded payslip file" : "Downloads the payslip PDF file to your device"}
        >
          {downloading ? <ActivityIndicator size="small" /> : (isDownloaded ? 'Open Payslip' : 'Download Payslip')}
        </Button>
        
        <Button
          theme="gray"
          variant="outlined"
          onPress={handlePreview}
          disabled={downloading}
          width="100%"
          accessibilityLabel="Preview payslip"
          accessibilityHint="Opens the payslip in a preview window"
        >
          Preview Payslip
        </Button>
      </YStack>

      {/* Permission Modal */}
      {Platform.OS === 'android' && (
        <PermissionModal
          open={showModal}
          onClose={closeModal}
          onRequestPermission={handleRequestPermission}
          title="Download PDF Needs Permissions"
          description="To download PDF files, this app needs storage permission. Please grant permission to continue."
          requestButtonText="Request Permissions"
          cancelButtonText="Cancel"
        />
      )}
    </YStack>
  );
}

