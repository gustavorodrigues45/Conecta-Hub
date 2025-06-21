import React from 'react';
import { NavLink } from 'react-router-dom';

// Placeholder icons - reuse from Header or create new ones if styles differ
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const PortfolioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>;
const AprendizagemIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /> </svg>; // Updated icon for "Aprendizagem" (e.g., a book or idea icon)
const VagasIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25V6.326a2.25 2.25 0 0 1 2.25-2.25H18M21 7.5l-3.75-3.75M17.25 3v4.5h4.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h3.75m-3.75 3h3.75m-3.75 3h3.75" /></svg>;


const MainNavigation: React.FC = () => {
    const navItemBaseClasses = "flex items-center justify-center font-medium px-4 py-3 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md";
    const activeNavItemClasses = "bg-brand-purple text-brand-yellow ring-2 ring-brand-purple-dark";
    const inactiveNavItemClasses = "bg-brand-yellow text-brand-purple-dark hover:bg-brand-yellow-dark";

    return (
        <nav className="bg-white py-3 shadow-md sticky top-[68px] z-40"> {/* Adjust top value based on Header height */}
            <div className="container mx-auto px-4">
                <ul className="flex justify-center space-x-2 sm:space-x-4">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `${navItemBaseClasses} ${isActive ? activeNavItemClasses : inactiveNavItemClasses}`}
                        >
                            <HomeIcon /> Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/portfolio"
                            className={({ isActive }) => `${navItemBaseClasses} ${isActive ? activeNavItemClasses : inactiveNavItemClasses}`}
                        >
                            <PortfolioIcon /> Portfólio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/aprendizagem"
                            className={({ isActive }) => `${navItemBaseClasses} ${isActive ? activeNavItemClasses : inactiveNavItemClasses}`}
                        >
                            <AprendizagemIcon /> Aprendizagem
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/vagas"
                            className={({ isActive }) => `${navItemBaseClasses} ${isActive ? activeNavItemClasses : inactiveNavItemClasses}`}
                        >
                            <VagasIcon /> Vagas
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default MainNavigation;