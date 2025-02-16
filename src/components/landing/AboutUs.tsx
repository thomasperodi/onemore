"use client";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section id="about" className="relative bg-gradient-to-br from-[#44034f] to-[#7c1890] text-white py-20 px-8 md:px-16 rounded-t-3xl shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-800 to-purple-600 opacity-30 blur-2xl -z-10"></div>
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400 animate-fade-in-up">
          Chi Siamo
        </h2>
        <p className="text-lg md:text-2xl leading-relaxed animate-fade-in-up delay-100 text-gray-200">
          OnemoreAndFam è il cuore pulsante degli eventi estivi a Pontenure, regalando esperienze indimenticabili presso Cala More. Con la presenza di celebri tiktoker, ogni serata è un mix perfetto di musica, divertimento e incontri speciali.
        </p>
        <p className="text-lg md:text-2xl leading-relaxed animate-fade-in-up delay-200 text-gray-200">
          Dai pool party esclusivi a eventi con influencer e DJ rinomati, OnemoreAndFam trasforma ogni notte estiva in un momento unico da vivere e condividere.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 animate-fade-in-up delay-300">
          <Link href="#contact" className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-700 text-xl font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
            Contattaci
          </Link>
          <Link href="/lista" className="px-10 py-4 border-2 border-pink-400 text-xl font-semibold rounded-full hover:bg-pink-500 hover:text-white transition duration-300">
            Scopri i Nostri Eventi
          </Link>
        </div>
        <div className="mt-12 text-sm text-gray-300 animate-fade-in-up delay-400">
          <p>
            <strong>Vivi l&apos;estate con OnemoreAndFam</strong>
          </p>
            
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
