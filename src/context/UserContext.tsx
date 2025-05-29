import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    nome: string;
    foto_perfil?: string;
}

interface UserContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
