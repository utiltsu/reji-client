import { ReceiptScreen } from "@/features/counter/components/receipt-screen";

type ReceiptPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { token } = await params;
  return <ReceiptScreen token={token} />;
}
