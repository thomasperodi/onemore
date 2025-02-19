

import AdminDashboardLayout from '@/components/Dashboard/Admin/DashboardLayout';
import GestionePR from '@/components/Dashboard/Admin/GestionePr';


const AdminDashboardComponent = () => {
  

  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
        {/* Add any children components here if needed */}
        <GestionePR />
        {/* Spazio prima del form */}
      
      </AdminDashboardLayout>
      
      
      
    </main>
  );
};

export default AdminDashboardComponent;
