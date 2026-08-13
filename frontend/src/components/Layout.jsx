import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-[#FAFAFC] dark:bg-[#0A0D14] text-slate-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FAFAFC] dark:bg-[#0A0D14] p-4 sm:p-6 md:p-8 scrollbar-hide transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
