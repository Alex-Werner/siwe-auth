import Web3Provider from "@/providers/Web3Provider/Web3Provider";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <>
            <Web3Provider>
                {children}
            </Web3Provider>
        </>

    )
}
