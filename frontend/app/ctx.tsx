import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { router } from "expo-router";
import { SERVER_URI } from '@/const';
import { User } from '@/interfaces';

const AuthContext = createContext<{
    signIn: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    signOut: () => void;
    updateUser: (updatedUser: User) => Promise<{ success: boolean; message?: string }>;
    getUser: () => Promise<User | null>;
    hasUser: () => boolean;
}>({
    signIn: async () => ({ success: false }),
    signOut: () => null,
    updateUser: async () => ({ success: false }),
    getUser: async () => null,
    hasUser: () => false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);

    const signIn = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${SERVER_URI}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const userData: User = await response.json();
                setCredentials({ username, password });
                console.log("SIGN IN: ", userData);
                return { success: true, message: 'Login Successful' };
            } else {
                const msg = await response.text();
                console.log('Signin failed', msg);
                return { success: false, message: 'Invalid Credentials' };
            }
        } catch (error) {
            console.error('Signin failed', error);
            return { success: false, message: 'Something went wrong, please try again later' };
        }
    };

    const signOut = () => {
        setCredentials(null);
        router.navigate('/sign-in');
    };

    const getUser = async (): Promise<User | null> => {
        if (!hasUser()) return null;

        try {
            const response = await fetch(`${SERVER_URI}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: credentials?.username, password: credentials?.password }),
            });

            if (response.ok) {
                const userData: User = await response.json();
                return userData;
            } else {
                console.error("Failed to fetch user");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    };

    const updateUser = async (updatedUser: User) => {
        try {
            const response = await fetch(`${SERVER_URI}/api/user`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                console.log("Updated user");
                return { success: true, message: 'Success' };
            } else {
                console.error("Failed to update user");
                return { success: false, message: 'Something went wrong, please try again later' };
            }
        } catch (error) {
            console.error("Update user error:", error);
            return { success: false, message: 'Something went wrong, please try again later' };
        }
    };

    const hasUser = (): boolean => {
        return !!(credentials);
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, updateUser, getUser, hasUser }}>
            {children}
        </AuthContext.Provider>
    );
}