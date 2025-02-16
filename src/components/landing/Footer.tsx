"use client"

import { Instagram } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="p-10 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
        <div id="contact">
          <h2 className="text-2xl font-bold mb-3">OnemoreAndFam.</h2>
          <p className="text-sm mb-4">Organizza e partecipa agli eventi migliori con facilità!</p>
          <p className="text-sm mb-1">Email: <a href="mailto:onemoreandfam@gmail.com" className="underline hover:text-purple-300">onemoreandfam@gmail.com</a></p>
          <p className="text-sm">Telefono: <a href="tel:+393482395186" className="underline hover:text-purple-300">+39 348 239 5186</a></p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Link Utili</h3>
          <ul className="space-y-3">
            <li><Link href="/privacy" className="hover:text-purple-300 transition">Privacy Policy</Link></li>
            <li><Link href="/cookie" className="hover:text-purple-300 transition">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Seguici</h3>
          <div className="flex justify-center md:justify-start gap-5">
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-transform transform hover:scale-110">
              <Instagram size={28} />
            </a>
            <a href="https://t.me/yourchannel" aria-label="Telegram" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-transform transform hover:scale-110">
              <FaTelegramPlane size={28} />
            </a>
            <a href="https://wa.me/yourwhatsappnumber" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-transform transform hover:scale-110">
              <FaWhatsapp size={28} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-4 text-sm text-gray-300 text-center">
        &copy; 2025 EventOrg. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
