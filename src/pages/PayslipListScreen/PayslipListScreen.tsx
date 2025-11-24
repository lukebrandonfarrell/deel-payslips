import { FlashList } from '@shopify/flash-list';
import { Button } from '@tamagui/button';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import PayslipCard from '../../components/PayslipCard/PayslipCard';
import { fetchPayslips } from '../../services/payslipService';
import { Payslip, SortOrder } from '../../types/payslip';

export default function PayslipListScreen() {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  
  // Use TanStack Query directly
  const { data: payslips = [], isLoading, error } = useQuery({
    queryKey: ['payslips', sortOrder],
    queryFn: () => fetchPayslips(sortOrder),
  });

  const renderPayslipItem = ({ item }: { item: Payslip }) => (
    <PayslipCard.Provider
      payslip={item}
      onPress={() => router.push(`/${item.id}`)}
    >
      <PayslipCard.Frame>
        <XStack alignItems="center" justifyContent="space-between">
          <YStack flex={1}>
            <PayslipCard.ID />
            <PayslipCard.Date />
          </YStack>
          <PayslipCard.Action />
        </XStack>
      </PayslipCard.Frame>
    </PayslipCard.Provider>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
          <Text fontSize="$4" color="$color10">Loading payslips...</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
          <Text fontSize="$4" color="$red10">Error loading payslips</Text>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} padding="$4" paddingTop="$4" backgroundColor="$background">
        {/* Sort Buttons */}
        <XStack gap="$2" marginBottom="$4">
          <Button
            theme={sortOrder === 'newest' ? 'blue' : undefined}
            variant={sortOrder === 'newest' ? undefined : 'outlined'}
            onPress={() => setSortOrder('newest')}
            flex={1}
            accessibilityLabel="Sort by most recent"
            accessibilityState={{ selected: sortOrder === 'newest' }}
          >
            Most Recent
          </Button>
          <Button
            theme={sortOrder === 'oldest' ? 'blue' : undefined}
            variant={sortOrder === 'oldest' ? undefined : 'outlined'}
            onPress={() => setSortOrder('oldest')}
            flex={1}
            accessibilityLabel="Sort by oldest first"
            accessibilityState={{ selected: sortOrder === 'oldest' }}
          >
            Oldest First
          </Button>
        </XStack>

        {/* Payslips List */}
        <FlashList
          data={payslips}
          renderItem={renderPayslipItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <YStack alignItems="center" justifyContent="center" paddingVertical="$12">
              <Text fontSize="$4" color="$color10">
                No payslips found
              </Text>
            </YStack>
          }
        />
      </YStack>
    </SafeAreaView>
  );
}

