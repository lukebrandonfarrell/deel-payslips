import { useQuery } from '@tanstack/react-query';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
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

  // On Android, open PDF externally using expo-sharing (handles file URI security)
  useEffect(() => {
    if (Platform.OS === 'android' && pdfUri && payslip) {
      const openPdf = async () => {
        try {
          // Copy file to cache directory (same approach as previewPayslip)
          const filename = `payslip-${payslip.id}.pdf`;
          const sourceFile = new File(pdfUri);
          const localFile = new File(Paths.cache, filename);

          // Copy to cache if it doesn't exist
          if (!localFile.exists) {
            try {
              sourceFile.copy(localFile);
            } catch (copyError: unknown) {
              const errorMessage = copyError instanceof Error ? copyError.message : String(copyError);
              if (!errorMessage.includes('already exists') && !errorMessage.includes('same name')) {
                throw copyError;
              }
            }
          }

          // Check if sharing is available
          const isAvailable = await Sharing.isAvailableAsync();
          if (!isAvailable) {
            console.error('Sharing is not available on this device');
            return;
          }

          // Open with native PDF viewer
          await Sharing.shareAsync(localFile.uri, {
            mimeType: 'application/pdf',
          });
        } catch (err) {
          console.error('Failed to open PDF:', err);
        }
      };

      openPdf();
    }
  }, [pdfUri, payslip]);

  if (isLoading || isLoadingUri) {
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

  // On Android, show a message that PDF is opening externally
  if (Platform.OS === 'android') {
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
        gap="$4"
      >
        <ActivityIndicator size="large" />
        <YStack gap="$2" alignItems="center">
          <Text fontSize="$6" textAlign="center">
            Opening PDF...
          </Text>
          <Text fontSize="$4" color="$color10" textAlign="center">
            The PDF will open in your default PDF viewer.
          </Text>
        </YStack>
      </YStack>
    );
  }

  // On iOS, use WebView (it works fine)
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
        originWhitelist={['*']}
      />
    </YStack>
  );
}

