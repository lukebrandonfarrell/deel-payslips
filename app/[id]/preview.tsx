import { useLocalSearchParams } from 'expo-router';
import { PDFPreviewPage } from '../../src/pages/PDFPreviewPage/PDFPreviewPage';

export default function PayslipPreviewRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <PDFPreviewPage payslipId={id as string} />;
}

