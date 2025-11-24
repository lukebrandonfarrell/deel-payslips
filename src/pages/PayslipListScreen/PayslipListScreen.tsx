import { Button } from '@tamagui/button';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Input, XStack, YStack } from 'tamagui';
import { PayslipList } from '../../components/PayslipList/PayslipList';
import { SortOrder } from '../../types/payslip';

export function PayslipListScreen() {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchText, setSearchText] = useState<string>('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} paddingTop="$4" backgroundColor="$background">
        <YStack borderBottomWidth={1} borderBottomColor="$gray4" paddingHorizontal="$4">
          {/* Search Input */}
          <Input
            placeholder="Search by ID, date, or year (e.g., 2024)..."
            value={searchText}
            onChangeText={setSearchText}
            marginBottom="$4"
            size="$4"
            borderWidth={1}
            accessibilityLabel="Search payslips by ID, date, or year"
          />

          {/* Sort Buttons */}
          <XStack gap="$2" marginBottom="$4">
            <Button
              theme={sortOrder === 'newest' ? 'yellow' : undefined}
              variant={sortOrder === 'newest' ? undefined : 'outlined'}
              onPress={() => setSortOrder('newest')}
              flex={1}
              accessibilityLabel="Sort by most recent"
              accessibilityState={{ selected: sortOrder === 'newest' }}
            >
              Most Recent
            </Button>
            <Button
              theme={sortOrder === 'oldest' ? 'yellow' : undefined}
              variant={sortOrder === 'oldest' ? undefined : 'outlined'}
              onPress={() => setSortOrder('oldest')}
              flex={1}
              accessibilityLabel="Sort by oldest first"
              accessibilityState={{ selected: sortOrder === 'oldest' }}
            >
              Oldest First
            </Button>
          </XStack>
        </YStack>

        {/* Payslips List */}
        <PayslipList
          filterOptions={{ searchText }}
          sortOrder={sortOrder}
          containerContentStyle={{ paddingVertical: 20 }}
        />
      </YStack>
    </SafeAreaView>
  );
}

