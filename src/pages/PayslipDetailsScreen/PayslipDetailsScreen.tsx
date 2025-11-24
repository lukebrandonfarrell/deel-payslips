import { Button } from '@tamagui/button';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { Card, Text, YStack } from 'tamagui';
import Badge from '../../components/Badge/Badge';
import { downloadPayslip, previewPayslip } from '../../services/fileService';
import { fetchPayslipById } from '../../services/payslipService';
import { formatDate } from '../../utils/dateFormatter';

interface PayslipDetailsScreenProps {
  payslipId: string;
}

export default function PayslipDetailsScreen({ payslipId }: PayslipDetailsScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  // Use TanStack Query directly
  const { data: payslip, isLoading, error } = useQuery({
    queryKey: ['payslip', payslipId],
    queryFn: () => fetchPayslipById(payslipId),
    enabled: !!payslipId,
  });

  const handleDownload = async () => {
    if (!payslip) return;
    setDownloading(true);
    await downloadPayslip(payslip);
    setDownloading(false);
  };

  const handlePreview = async () => {
    if (!payslip) return;
    setPreviewing(true);
    await previewPayslip(payslip);
    setPreviewing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
          <ActivityIndicator size="large" />
        </YStack>
      </SafeAreaView>
    );
  }

  if (error || !payslip) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$4" backgroundColor="$background">
          <Text fontSize="$6" marginBottom="$2">Payslip Not Found</Text>
          <Text fontSize="$4" color="$color10" textAlign="center">
            The requested payslip could not be found.
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$4" paddingTop="$4" backgroundColor="$background">
          <Card elevate size="$4" bordered marginBottom="$4" padding="$4">
            <YStack gap="$4">
              <Text fontSize="$6" fontWeight="600">Payslip Details</Text>
              
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

          {/* Actions */}
          <YStack gap="$3" marginBottom="$6">
            <Button
              theme="blue"
              onPress={handleDownload}
              disabled={downloading || previewing}
              width="100%"
              accessibilityLabel="Download payslip to device"
              accessibilityHint="Downloads the payslip PDF file to your device"
            >
              {downloading ? 'Downloading...' : 'Download Payslip'}
            </Button>
            
            <Button
              theme="gray"
              variant="outlined"
              onPress={handlePreview}
              disabled={downloading || previewing}
              width="100%"
              accessibilityLabel="Preview payslip"
              accessibilityHint="Opens the payslip in a preview window"
            >
              {previewing ? 'Opening...' : 'Preview Payslip'}
            </Button>
          </YStack>

          {(downloading || previewing) && (
            <YStack alignItems="center" paddingVertical="$4">
              <ActivityIndicator size="small" />
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

