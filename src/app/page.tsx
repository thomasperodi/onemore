import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';

import PastEvents from '@/components/landing/PastEvents';
import AboutUs from '@/components/landing/AboutUs';

const LandingPage = () => {
  

  return (
    <main className="space-y-0">
      <Navbar />
      {/* Hero Section */}
      <Hero />
      
      {/* Spazio prima del form */}
      <div className="py-12" />
      
      
      
      
      {/* Past Events Section */}
      <PastEvents />
      
      {/* Spazio dopo gli eventi passati */}
      <div className="py-12" />
      
      {/* Testimonials Section */}
      <AboutUs />
      
      {/* Spazio prima del footer */}
      <div className="py-12" />
      
      
    </main>
  );
};

export default LandingPage;
