// components/Layout.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaBell, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';

export default function Layout({ children }) {
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {session && (
                <nav className="bg-indigo-600 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <NavLink href="/dashboard">Home</NavLink>
                                    <NavLink href="/dashboard/reminders">Reminders</NavLink>
                                    <NavLink href="/dashboard/tasks">Tasks</NavLink>
                                    <NavLink href="/dashboard/mealplanner">Meal Planner</NavLink>
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                <div className="ml-3 relative" ref={dropdownRef}>
                                    <div>
                                        <button onClick={toggleDropdown} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out">
                                            <Image
                                                className="h-8 w-8 rounded-full"
                                                src={session.user.image || '/images/default-avatar.webp'}
                                                alt="User avatar"
                                                width={32}
                                                height={32}
                                            />
                                        </button>
                                    </div>
                                    {isDropdownOpen && <DropdownMenu />}
                                </div>
                            </div>
                            <div className="-mr-2 flex items-center sm:hidden">
                                <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white transition duration-150 ease-in-out">
                                    <FaBars className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="sm:hidden">
                            <div className="pt-2 pb-3 space-y-1">
                                <MobileNavLink href="/dashboard">Home</MobileNavLink>
                                <MobileNavLink href="/dashboard/reminders">Reminders</MobileNavLink>
                                <MobileNavLink href="/dashboard/tasks">Tasks</MobileNavLink>
                                <MobileNavLink href="/dashboard/mealplanner">Meal Planner</MobileNavLink>
                            </div>
                            <div className="pt-4 pb-3 border-t border-indigo-700">
                                <div className="flex items-center px-4">
                                    <div className="flex-shrink-0">
                                        <Image
                                            className="h-10 w-10 rounded-full"
                                            src={session.user.image || '/default-avatar.webp'}
                                            alt="User avatar"
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{session.user.name}</div>
                                        <div className="text-sm font-medium text-indigo-300">{session.user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <MobileNavLink href="/dashboard/profile">Profile</MobileNavLink>
                                    <MobileNavLink href="/dashboard/notifications">Notifications</MobileNavLink>
                                    <MobileNavLink href="/dashboard/settings">Settings</MobileNavLink>
                                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:text-white transition duration-150 ease-in-out">
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            )}

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, children }) {
    return (
        <Link href={href} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-200 hover:text-white hover:border-white transition duration-150 ease-in-out">
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children }) {
    return (
        <Link href={href} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-200 hover:text-white hover:bg-indigo-500 hover:border-white transition duration-150 ease-in-out">
            {children}
        </Link>
    );
}

function DropdownMenu() {
    return (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg z-50">
            <div className="rounded-md bg-white shadow-xs">
                <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm leading-5 font-medium text-gray-900">
                        Signed in as
                    </p>
                    <p className="text-sm leading-5 font-medium text-gray-500 truncate">
                        example@email.com
                    </p>
                </div>
                <div className="py-1">
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">
                        <FaUser className="inline-block mr-2" /> Profile
                    </Link>
                    <Link href="/dashboard/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">
                        <FaBell className="inline-block mr-2" /> Notifications
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">
                        <FaCog className="inline-block mr-2" /> Settings
                    </Link>
                </div>
                <div className="border-t border-gray-200">
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">
                        <FaSignOutAlt className="inline-block mr-2" /> Sign out
                    </button>
                </div>
            </div>
        </div>
    );
}