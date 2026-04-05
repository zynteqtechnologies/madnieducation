import { Users } from 'lucide-react';
import LoginForm from '@/components/layout/LoginForm';

export default function SubAdminLoginPage() {
  return (
    <LoginForm
      roleName="Subadmin"
      loginEndpoint="/api/auth/login/subadmin"
      accentColor="emerald"
      roleIcon={<Users size={16} />}
    />
  );
}
