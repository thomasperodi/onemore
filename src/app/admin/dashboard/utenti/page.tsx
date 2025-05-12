

import AdminDashboardLayout from '@/components/Dashboard/Admin/DashboardLayout';
import  {GestioneUtenti } from '@/components/Dashboard/Admin/GestioneUtenti';


const GestioneUtentiPage = () => {
  

  return (
    <main className="space-y-0">
      <AdminDashboardLayout>
        {/* Add any children components here if needed */}
        <GestioneUtenti/>
        {/* Spazio prima del form */}
      
      </AdminDashboardLayout>
      
      
      
    </main>
  );
};

export default GestioneUtentiPage;
