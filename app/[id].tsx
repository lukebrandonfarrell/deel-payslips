import { useLocalSearchParams } from 'expo-router';
import { PayslipDetailsScreen } from '../src/pages/PayslipDetailsScreen/PayslipDetailsScreen';

export default function PayslipDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <PayslipDetailsScreen payslipId={id as string} />;
}
