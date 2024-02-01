'use client';
import {createContext} from "react";

export interface Web3ContextInterface {
    provider: any;
    signer: any;
    address: string;
    chainId: string;
    network: string;
    balance: string;
    wallet: { address: string, balance: string } | null;
    connect: () => void;
    signMessage: (message: string) => Promise<string>;
    clearWeb3Context: () => void;
}

const Web3Context = createContext<Web3ContextInterface>({
    provider: null,
    signer: null,
    address: "",
    chainId: "",
    network: "",
    balance: "",
    wallet: null,
    connect: () => {},
    clearWeb3Context: () => {},
    signMessage: async (message: string) => {
        return "";
    }
});

export default Web3Context;
