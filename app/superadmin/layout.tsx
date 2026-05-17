import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Madni Education - Super Admin',
  description: 'Super Administrative Control Center',
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
