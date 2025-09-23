import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="pt-20"> {/* Add top padding to avoid content being hidden by the fixed header */}
                <Outlet /> {/* Child routes will be rendered here */}
            </main>
        </div>
    );
};

export default Layout;
