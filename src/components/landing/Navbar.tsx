"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="relative bg-[#44034f] text-white p-4 z-50 w-full flex items-center justify-between">
      {/* LOGO - TUTTO A SINISTRA */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/onemoreandfam.png"
            alt="OnemoreAndFam Logo"
            width={180}
            height={50}
            priority
          />
        </Link>
      </div>

      {/* NAVIGATION - CENTRATA */}
      <ul className="hidden md:flex gap-6 text-lg flex-1 justify-center">
        <li className="hover:bg-[#c634ef] px-4 py-2 rounded">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:bg-[#c634ef] px-4 py-2 rounded">
          <Link href="/#events">Eventi</Link>
        </li>
        <li className="hover:bg-[#c634ef] px-4 py-2 rounded">
          <Link href="/#about">About</Link>
        </li>
        <li className="hover:bg-[#c634ef] px-4 py-2 rounded">
          <Link href="/#contact">Contact</Link>
        </li>
      </ul>

      {/* LOGIN - TUTTO A DESTRA */}
      <div className="hidden md:flex">
        <Link
          href="/auth/login"
          className="bg-[#c634ef] px-5 py-2 rounded flex items-center hover:bg-[#b125d4]"
        >
          <FaUser className="mr-2" />
          <span>Login</span>
        </Link>
      </div>

      {/* MOBILE MENU TOGGLE */}
      <button
        className="md:hidden p-2 bg-[#7c1890] rounded"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-[#691976] flex flex-col items-center justify-center transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <button
          className="absolute top-5 right-5 p-3 bg-[#c634ef] rounded-full"
          onClick={toggleMenu}
        >
          <FaTimes size={24} />
        </button>

        <Link
          href="/"
          className="py-3 text-xl hover:bg-[#dd78fa] w-full text-center"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/#events"
          className="py-3 text-xl hover:bg-[#dd78fa] w-full text-center"
          onClick={() => setMenuOpen(false)}
        >
          Eventi
        </Link>
        <Link
          href="/#about"
          className="py-3 text-xl hover:bg-[#dd78fa] w-full text-center"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/#contact"
          className="py-3 text-xl hover:bg-[#dd78fa] w-full text-center"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>

        {/* LOGIN MOBILE */}
        <Link
          href="/auth/login"
          className="mt-4 bg-[#c634ef] px-6 py-3 rounded flex items-center hover:bg-[#b125d4]"
          onClick={() => setMenuOpen(false)}
        >
          <FaUser className="mr-2" />
          <span>Login</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
