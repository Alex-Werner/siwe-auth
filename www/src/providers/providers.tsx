import AuthProvider from "@/providers/AuthProvider/AuthProvider";
import Web3Provider from "@/providers/Web3Provider/Web3Provider";
import ProfileProvider from "@/providers/ProfileProvider/ProfileProvider";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <Web3Provider>
            <AuthProvider>
                <ProfileProvider>
                    {children}
                </ProfileProvider>
            </AuthProvider>
        </Web3Provider>
    )
}
