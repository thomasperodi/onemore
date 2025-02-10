import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import Carousel from '@/components/landing/Carousel';
import PastEvents from '@/components/landing/PastEvents';
import JoinListForm from '@/components/landing/JoinListForm';

const LandingPage = () => {
  const carouselImages = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];
  const pastEvents = [
    { title: "Event 1", description: "An amazing experience.", date: "2024-01-15" },
    { title: "Event 2", description: "A night to remember.", date: "2024-02-20" },
  ];

  return (
    <main className="space-y-0">
      <Navbar />
      {/* Hero Section */}
      <Hero />
      
      {/* Spazio prima del form */}
      <div className="py-12" />
      
      {/* Join List Form */}
      <JoinListForm />
      
      {/* Spazio dopo il form */}
      <div className="py-12" />
      
      {/* Carousel Section */}
      <Carousel images={carouselImages} />
      
      {/* Spazio dopo il carousel */}
      <div className="py-12" />
      
      {/* Past Events Section */}
      <PastEvents events={pastEvents} />
      
      {/* Spazio dopo gli eventi passati */}
      <div className="py-12" />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Spazio prima del footer */}
      <div className="py-12" />
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;
