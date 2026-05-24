import { getSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EventGallery from '@/components/dashboard/sub-admin/EventGallery';

export default async function EventsPage() {
  const session = await getSessionFromCookies('ADMIN');
  if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
    redirect('/subadmin/login');
  }

  return (
    <DashboardLayout title="Events" role="SUB_ADMIN" activeItem="Events">
      <EventGallery schoolId={session.schoolId} />
    </DashboardLayout>
  );
}
