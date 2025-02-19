

import AdminDashboardLayout from '@/components/Dashboard/Admin/DashboardLayout';
import GestioneEventi from '@/components/Dashboard/Admin/GestioneEventi';
import ListaEventi from '@/components/Dashboard/Admin/ListaEventi';

const AdminDashboardComponent = () => {
  

  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
        <GestioneEventi/>
        <div className="py-0" />
        <ListaEventi/>
      </AdminDashboardLayout>
      
      
      
    </main>
  );
};

export default AdminDashboardComponent;
