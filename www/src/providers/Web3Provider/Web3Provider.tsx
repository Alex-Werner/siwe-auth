'use client';
import React, {useEffect} from "react";
import Web3Context from "@/context/Web3Context";
import {ethers} from "ethers";
import getProvider from "@/providers/Web3Provider/utils/getProvider";

export function Web3Provider({children}: { children: React.ReactNode }) {

    const [provider, setProvider] = React.useState<any>(null);
    const [signer, setSigner] = React.useState<any>(null);
    const [address, setAddress] = React.useState<string>("");
    const [chainId, setChainId] = React.useState<string>("");
    const [network, setNetwork] = React.useState<string>("");
    const [balance, setBalance] = React.useState<string>("");

    const [wallet, setWallet] = React.useState<any>(null);

    async function clearWeb3Context(){
        setProvider(null);
        setSigner(null);
        setAddress("");
        setChainId("");
        setNetwork("");
        setBalance("");
        setWallet(null);
    }

    async function connect() {
        const provider = getProvider();
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const [account, ...secondaryAccounts] = accounts;
        const chainId = await provider.request({ method: 'eth_chainId' });
        setWallet({
            address: account,
            chainId,
        })

        const signer = provider.signer;
        setSigner(signer);
    }

    async function signMessage(message: string) {
        const provider = getProvider();
        const normalizedAddress = ethers.getAddress(wallet.address);
        const signature = await provider.request({ method: 'personal_sign', params: [message, normalizedAddress] });
        return signature;
    }

    useEffect(() => {
        const provider = localStorage.getItem("provider");
        const signer = localStorage.getItem("signer");
        const address = localStorage.getItem("address");
        const chainId = localStorage.getItem("chainId");
        const network = localStorage.getItem("network");
        const balance = localStorage.getItem("balance");

        if (provider && signer && address && chainId && network && balance) {
            setProvider(provider);
            setSigner(signer);
            setAddress(address);
            setChainId(chainId);
            setNetwork(network);
            setBalance(balance);
        }
    }, []);


    return (
        <Web3Context.Provider value={{
            provider,
            signer,
            address,
            chainId,
            network,
            balance,
            wallet,

            signMessage,
            connect,
            clearWeb3Context,
        }}>
            {children}
        </Web3Context.Provider>
    );
}

export default Web3Provider;
