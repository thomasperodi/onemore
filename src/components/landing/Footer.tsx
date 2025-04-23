import { Instagram } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="p-6 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 text-white text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
        <div id="contact">
          <h2 className="text-xl font-bold mb-2">OnemoreAndFam.</h2>
          <p className="mb-2">Organizza e partecipa agli eventi migliori con facilità!</p>
          <p className="mb-1">
            Email: <a href="mailto:onemoreandfam@gmail.com" className="underline hover:text-purple-300">onemoreandfam@gmail.com</a>
          </p>
          <p>
            Telefono: <a href="tel:+393482395186" className="underline hover:text-purple-300">+39 348 239 5186</a>
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3">Link Utili</h3>
          <ul className="space-y-2">
            <li>
              <Link href="https://www.iubenda.com/privacy-policy/37922822" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition">Privacy Policy</Link>
            </li>
            <li>
              <Link href="https://www.iubenda.com/privacy-policy/37922822/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition">Cookie Policy</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3">Seguici</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://www.instagram.com/onemoreandfam" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-transform transform hover:scale-110">
              <Instagram size={24} />
            </a>
            <a href="https://t.me/onemoreandfam" aria-label="Telegram" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-transform transform hover:scale-110">
              <FaTelegramPlane size={24} />
            </a>
            <a href="https://wa.me/393482395186" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-transform transform hover:scale-110">
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-600 pt-3 text-xs text-gray-300 text-center">
        &copy; 2025 OnemoreAndFam. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;