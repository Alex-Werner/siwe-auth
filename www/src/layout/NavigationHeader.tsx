'use client';
import React, {useContext} from 'react';
import Link from 'next/link';
import AuthContext from "@/context/AuthContext";

interface NavigationHeaderProps {}
const NavigationHeader: React.FC<NavigationHeaderProps> = ({  }) => {

    const authenticatedNavigation = [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Profile',
            href: '/profile/me',
        },
        {
            label: 'Logout',
            href: '/auth/logout',
        },
    ]

    const guestNavigation = [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Signup',
            href: '/auth/signup',
        },
        {
            label: 'Signin',
            href: '/auth/signin',
        },
    ]

    const { isAuthenticated } = useContext(AuthContext)
    const navigation =  isAuthenticated ? authenticatedNavigation : guestNavigation;
    return (
        <header className="flex justify-between items-center sticky top-0">
            <ul className="flex">
                {navigation.map((item, index) => (
                    <li key={index} className="ml-4">
                        <Link href={item.href}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </header>
    );
}

export default NavigationHeader;
