'use client';
import React, {useEffect} from "react";
import AuthContext from "@/context/AuthContext";
import {SiweMessage} from "siwe";
import {ethers} from "ethers";
import axios from "axios";
import api from "@/lib/http";
import Cookies from "js-cookie";

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [username, setUsername] = React.useState<string>("");
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
    const [accessToken, setAccessToken] = React.useState<string>("");
    const [refreshToken, setRefreshToken] = React.useState<string>("");


    useEffect(() => {
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");

        if (accessToken && refreshToken) {
            setIsAuthenticated(true);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
        }
    }, []);

    async function fetchNonce() {
        const result = await api.get('/siwe/nonce');
        return result.data.nonce;
    }
    async function createSiweMessage(address: string, statement?:string) {
        const normalizedAddress = ethers.getAddress(address);
        const nonce = await fetchNonce()

        const siweMessage = new SiweMessage({
            statement: statement ?? 'Signing-in to siwe-auth with Ethereum Wallet',
            domain: window.location.host,
            uri: window.location.origin,
            version: '1',
            chainId: 1,
            address: normalizedAddress,
            nonce,
        });
        return siweMessage;
    }

    function clearAuthContext() {
        setAccessToken("");
        setRefreshToken("");
        Cookies.set("access_token", "");
        Cookies.set("refresh_token", "");
        setIsAuthenticated(false);
    }

    const exportedValue = {
        accessToken,
        refreshToken,
        isAuthenticated,
        createSiweMessage,
        username,
        setUsername,
        setIsAuthenticated,
        setAccessToken,
        clearAuthContext,
    };

    return (
        <AuthContext.Provider value={{...exportedValue}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
