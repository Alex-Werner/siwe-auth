import AuthProvider from "@/providers/AuthProvider/AuthProvider";
import Web3Provider from "@/providers/Web3Provider/Web3Provider";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <>
            <Web3Provider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </Web3Provider>
        </>

    )
}
