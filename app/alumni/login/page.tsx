import { GraduationCap } from 'lucide-react';
import LoginForm from '@/components/layout/LoginForm';

export default function AlumniLoginPage() {
  return (
    <LoginForm
      roleName="Alumni"
      loginEndpoint="/api/auth/login/alumni"
      accentColor="amber"
      roleIcon={<GraduationCap size={16} />}
    />
  );
}
