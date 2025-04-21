import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Link } from 'wouter';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white py-4 border-b-2 border-black">
      <div className="container mx-auto flex justify-center items-center">
        <Link href="/">
          <a className="flex items-center">
            <span className="text-2xl font-bold bg-purple-600 text-white px-2 py-1">Hitung</span>
            <span className="text-2xl font-bold bg-yellow-400 text-black px-2 py-1">Yuk</span>
          </a>
        </Link>
        
        {/* Menghapus tombol profil di header untuk tampilan mobile */}
      </div>
    </header>
  );
};

export default Navbar;
