import AdminDashboardLayout from '@/components/Dashboard/Admin/DashboardLayout';
import GuestCount from '@/components/Dashboard/Admin/GuestCount';
import EventHistory from '@/components/Dashboard/Admin/EventHistory';

const AdminDashboardComponent = () => {
  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
        <GuestCount />
        <div className="py-2" />
        <EventHistory />
      </AdminDashboardLayout>
    </main>
  );
};

export default AdminDashboardComponent;
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Dashboard for admin users',
};
export const dynamic = 'force-dynamic'; // Force revalidation on every request