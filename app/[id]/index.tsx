import { Redirect, useLocalSearchParams } from 'expo-router';

export default function PayslipIndexRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Redirect to detail page by default
  return <Redirect href={`/${id}/detail`} />;
}

