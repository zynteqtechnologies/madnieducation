import { getSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SchoolPageManager from '@/components/dashboard/sub-admin/SchoolPageManager';

export default async function SubadminSchoolPage() {
  const session = await getSessionFromCookies('ADMIN');
  if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
    redirect('/subadmin/login');
  }

  return (
    <DashboardLayout title="School Page" role="SUB_ADMIN" activeItem="School Page">
      <SchoolPageManager />
    </DashboardLayout>
  );
}
