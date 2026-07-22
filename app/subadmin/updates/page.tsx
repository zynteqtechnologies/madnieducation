import { getSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewsUpdatesManager from '@/components/dashboard/shared/NewsUpdatesManager';

export default async function SubAdminUpdatesPage() {
  const session = await getSessionFromCookies('ADMIN');
  if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
    redirect('/subadmin/login');
  }

  return (
    <DashboardLayout title="Updates" role="SUB_ADMIN" activeItem="Updates">
      <NewsUpdatesManager role="SUB_ADMIN" />
    </DashboardLayout>
  );
}
