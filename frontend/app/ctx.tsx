import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import Constants from "expo-constants";
import {router} from "expo-router";
import { SERVER_URI } from '@/const';
import { useStorageState } from './useStorageState';



const AuthContext = createContext<{
    signIn: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    signOut: () => void;
    updateUser: () => Promise<{ success: boolean; message?: string }>;
    refreshUser: () => Promise<{ success: boolean; message?: string }>;
    user: User | null;
    isLoading: boolean;
    session?: string | null;
}>({
    signIn: async () => ({ success: false }),
    signOut: () => null,
    updateUser: async () => ({ success: false }),
    refreshUser: async() => ({ success: false }),
    user: null,
    isLoading: false,
    session: null,
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
    const [user, setUser] = useState<User | null>(null);
    const [[isLoading, session], setSession] = useStorageState('session');

    const signIn = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
          const uri =
            Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ?? SERVER_URI;
    
          const response = await fetch(`http://${uri}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
    
          if (response.ok) {
            const userData: User = await response.json();
            userData.password = password;
            setUser(null);
            setUser({ ...userData });
            setSession(userData.username);
            console.log("SIGN IN: ", userData);

            // Navigate after signing in. You may want to tweak this to ensure sign-in is
            // successful before navigating.
            router.navigate('/inventory');
            console.log("Login Sucessful");
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
        setUser(null);
        setSession(null);
        router.navigate('/login');
      };

      const updateUser = async () => {
        if (!user) return { success: false, message: 'Not currently logged in' };

        const putResponse = await fetch(`http://${SERVER_URI}/api/user`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })

        console.log(putResponse.status);
        console.log(`OK? ${putResponse.ok}`);

        if (putResponse.ok) {
            console.log("Updated User");
            return { success: true, message: 'Success' };
        } else {
            console.error("Failed to update user");
            return { success: false, message: 'Something went wrong, please try again later' };
        }
      }

      const refreshUser = async () => {
        if (!user) return { success: false, message: 'Not currently logged in' };

        const response = await signIn(user.username, user.password);
        return response;
      }
    
      return (
        <AuthContext.Provider value={{ signIn, signOut, updateUser, refreshUser, user, isLoading, session }}>
          {children}
        </AuthContext.Provider>
      );
    }