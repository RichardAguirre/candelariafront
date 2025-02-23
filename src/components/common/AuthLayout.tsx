import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen w-full bg-purple-300">
      <div className="flex w-full max-w-5xl mx-auto my-auto overflow-hidden rounded-lg shadow-xl h-[90vh]">
        <div className="relative hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-400 to-purple-700 h-full">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20">
              <div className="w-8 h-8 border border-white/30 rotate-45"></div>
            </div>
            <div className="absolute top-40 right-20">
              <div className="w-10 h-10 rounded-full border border-white/30"></div>
            </div>
            <div className="absolute bottom-40 left-20">
              <div className="w-12 h-12 rounded-full border border-white/30"></div>
            </div>

            <svg className="absolute left-0 top-0 h-full w-32 text-white/10" viewBox="0 0 100 600" preserveAspectRatio="none">
              <path d="M0,0 C30,150 70,300 30,450 C0,600 0,600 0,600 L0,0 Z" fill="currentColor"></path>
            </svg>
            <svg className="absolute right-0 bottom-0 h-full w-40 text-white/10" viewBox="0 0 100 600" preserveAspectRatio="none">
              <path d="M100,600 C70,450 30,300 70,150 C100,0 100,0 100,0 L100,600 Z" fill="currentColor"></path>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
            <h2 className="text-5xl font-bold mb-6">Welcome back!</h2>
            <p className="text-xl">
              You can sign in to access with your existing account.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center h-full">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-700 mb-8">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};