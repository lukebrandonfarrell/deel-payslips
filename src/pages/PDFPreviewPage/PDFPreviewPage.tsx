import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Text, YStack } from 'tamagui';
import { resolveAssetUri } from '../../services/fileService/fileService';
import { fetchPayslipById } from '../../services/payslipService/payslipService';

interface PDFPreviewPageProps {
  payslipId: string;
}

export function PDFPreviewPage({ payslipId }: PDFPreviewPageProps) {
  const insets = useSafeAreaInsets();

  // Fetch payslip data
  const { data: payslip, isLoading, error } = useQuery({
    queryKey: ['payslip', payslipId],
    queryFn: () => fetchPayslipById(payslipId),
    enabled: !!payslipId,
  });

  // Resolve PDF URI
  const { data: pdfUri, isLoading: isLoadingUri } = useQuery({
    queryKey: ['payslip-uri', payslipId, payslip?.file],
    queryFn: async () => {
      if (!payslip?.file) return null;
      return await resolveAssetUri(payslip.file);
    },
    enabled: !!payslip?.file,
  });

  if (isLoading || isLoadingUri) {
    return (
      <YStack 
        flex={1} 
        alignItems="center" 
        justifyContent="center" 
        backgroundColor="$red"
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

  if (!pdfUri) {
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
        <Text fontSize="$6" marginBottom="$2">Unable to Load PDF</Text>
        <Text fontSize="$4" color="$color10" textAlign="center">
          Could not resolve the PDF file URI.
        </Text>
      </YStack>
    );
  }

  return (
    <YStack 
      flex={1} 
      backgroundColor="$background"
    >
      <WebView
        source={{ uri: pdfUri }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
            <ActivityIndicator size="large" />
          </YStack>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        // Enable JavaScript for PDF rendering
        javaScriptEnabled={true}
        // Allow file access for local PDFs
        allowFileAccess={true}
        // For Android, allow universal access from file URLs
        originWhitelist={['*']}
      />
    </YStack>
  );
}

