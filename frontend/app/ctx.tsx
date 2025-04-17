import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import Constants from "expo-constants";
import {router} from "expo-router";
import { SERVER_URI } from '@/const';

const AuthContext = createContext<{
    signIn: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: async () => ({ success: false }),
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
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
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
                    // Perform sign-in logic here
                    try {
                        //need to find the ip of the localhost since the backend is not running on the same device
                        const uri =
                            Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
                            SERVER_URI;
                        const response = await fetch(`http://${uri}/api/auth/login`, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({username: username, password: password})
                        });

                        if (response.ok) {
                            const userData = await response.json();
                            console.log("Signin response: ", userData);
                            setSession(userData.username);
                            // Navigate after signing in. You may want to tweak this to ensure sign-in is
                            // successful before navigating.
                            router.navigate('/inventory');
                            return { success: true, message: "Login Successful" };
                        } else {
                            console.log('Signin failed', await response.text());
                            return { success: false, message: "Invalid Credentials" };
                        }
                    } catch (error) {
                        console.error('Signin failed', error);
                        return { success: false, message: "Something went wrong, please try again later" };
                    }
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
