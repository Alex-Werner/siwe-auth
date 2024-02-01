'use client';
import {createContext} from "react";

export interface AuthContextInterface {
    isAuthenticated: boolean;
    accessToken: string;
    refreshToken: string;
    username: string;
    createSiweMessage: (address:string, statement?:string) => Promise<any>;
    clearAuthContext: () => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setAccessToken: (accessToken: string) => void;

}

const AuthContext = createContext<AuthContextInterface>({
    isAuthenticated: false,
    accessToken: "",
    refreshToken: "",
    username: "",
    createSiweMessage: async (address:string, statement?:string) => {
        return {};
    },
    clearAuthContext: () => {},
    setIsAuthenticated: (isAuthenticated: boolean) => {},
    setAccessToken: (accessToken: string) => {},

});

export default AuthContext;
