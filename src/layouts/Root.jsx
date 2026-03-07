import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop';

const Root = () => {
    return (
        <div className="app-shell">
            <ScrollToTop />
            <Navbar />
            <main className="app-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Root;
