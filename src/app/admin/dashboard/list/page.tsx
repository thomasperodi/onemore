

import AdminDashboardLayout from '@/components/Dashboard/Admin/DashboardLayout';

import ListaOspiti from '@/components/Dashboard/Admin/Lista';

const AdminDashboardComponent = () => {
  

  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
        {/* Add any children components here if needed */}
        <ListaOspiti />
        {/* Spazio prima del form */}
      
      </AdminDashboardLayout>
      
      
      
    </main>
  );
};

export default AdminDashboardComponent;
