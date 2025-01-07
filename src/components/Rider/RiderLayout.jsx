import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RiderLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b h-16 fixed top-0 right-0 left-0 z-30">
        <div className="flex items-center justify-between h-full px-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-semibold text-lg">Rider Panel</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-sm font-medium">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'R'}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {user?.displayName || 'Rider'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RiderLayout; 