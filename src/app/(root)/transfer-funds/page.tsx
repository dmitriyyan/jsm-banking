import { HeaderBox } from '@/components/HeaderBox';
import { TransferFundsForm } from '@/components/TransferFundsForm';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

export default async function PaymentTransfer({
  searchParams: { id, page },
}: {
  searchParams: { id: string; page: string };
}) {
  const user = await getLoggedInUser();
  const accounts = await getAccounts({ userId: user.$id });
  if (!accounts) {
    return null;
  }

  const appwriteItemId = id || accounts.data[0].appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  const currentPage = page ? parseInt(page, 10) : 1;

  return (
    <section className="no-scrollbar flex flex-col overflow-y-scroll bg-gray-25 p-8 md:max-h-screen xl:py-12">
      <HeaderBox
        title="Transfer Funds"
        subtext="Please provide any specific details for the transfer"
      />
      <div className="size-full pt-5">
        <TransferFundsForm accounts={accounts.data} />
      </div>
    </section>
  );
}
