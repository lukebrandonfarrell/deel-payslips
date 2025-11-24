import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { fetchPayslips } from '../../services/payslipService';
import { Payslip, PayslipFilters } from '../../types/payslip';
import { PayslipCard } from '../PayslipCard/PayslipCard';

interface PayslipListProps {
  filterOptions: Pick<PayslipFilters, 'searchText'>;
  sortOrder: PayslipFilters['sortOrder'];
  containerContentStyle?: StyleProp<ViewStyle>;
}

export function PayslipList({ filterOptions, sortOrder, containerContentStyle }: PayslipListProps) {
  const router = useRouter();
  const { data: payslips = [], isLoading, error } = useQuery({
    queryKey: ['payslips', sortOrder, filterOptions.searchText],
    queryFn: () => fetchPayslips({
      sortOrder,
      searchText: filterOptions.searchText,
    }),
  });

  const renderPayslipItem = React.useCallback(({ item }: { item: Payslip }) => (
    <PayslipCard.Provider
      payslip={item}
      onPress={() => router.push(`/${item.id}`)}
    >
      <PayslipCard.Frame>
        <XStack alignItems="center" justifyContent="space-between">
          <YStack flex={1} rowGap="$2">
            <PayslipCard.ID />
            <PayslipCard.Date />
          </YStack>
          <PayslipCard.Action />
        </XStack>
      </PayslipCard.Frame>
    </PayslipCard.Provider>
  ), [router]);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" paddingVertical="$12">
        <Text fontSize="$4" color="$color10">Loading payslips...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" paddingVertical="$12">
        <Text fontSize="$4" color="$red10">Error loading payslips</Text>
      </YStack>
    );
  }

  return (
    <FlashList
      data={payslips}
      renderItem={renderPayslipItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[{ paddingBottom: 20 }, containerContentStyle]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <YStack alignItems="center" justifyContent="center" paddingVertical="$12">
          <Text fontSize="$4" color="$color10">
            No payslips found
          </Text>
        </YStack>
      }
    />
  );
}

