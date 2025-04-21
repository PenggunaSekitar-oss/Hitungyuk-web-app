import React from 'react';
import { useAuth } from '../lib/auth-context';
import { Link } from 'wouter';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b-4 border-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard">
            <a className="text-2xl font-bold title">Hitungyuk</a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <a className="font-bold hover:text-primary">Dashboard</a>
              </Link>
              <Link href="/calculator">
                <a className="font-bold hover:text-primary">Kalkulator</a>
              </Link>
              <Link href="/profile">
                <a className="font-bold hover:text-primary">Profil</a>
              </Link>
              <button 
                onClick={logout}
                className="neu-button-secondary py-2 px-4"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="neu-button-secondary py-2 px-4">Masuk</a>
              </Link>
              <Link href="/signup">
                <a className="neu-button py-2 px-4">Daftar</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
