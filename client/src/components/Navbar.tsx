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
        
        <div className="absolute right-4">
          {isAuthenticated ? (
            <Link href="/profile">
              <a className="neu-button-secondary p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>
            </Link>
          ) : (
            <Link href="/login">
              <a className="neu-button-secondary p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
