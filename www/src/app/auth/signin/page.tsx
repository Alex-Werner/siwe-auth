'use client';
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import Web3Context from "@/context/Web3Context";
import ProfileContext from "@/context/ProfileContext";
import api from "@/lib/http";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const AuthSignInPage = () => {
    const {connect, clearWeb3Context, wallet, signMessage} = useContext(Web3Context);
    const {setIsAuthenticated, setAccessToken, createSiweMessage} = useContext(AuthContext);
    const {clearProfile, fetchAndSetProfile} = useContext(ProfileContext)

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formUsername, setFormUsername] = useState('');
    const router = useRouter();

    const handleSignIn = async () => {
        if (!wallet?.address) {
            setError('Wallet is not connected');
            return;
        }

        setIsLoading(true);
        try {
            const statement = `Sign in as ${formUsername}`;
            const siweMessage = await createSiweMessage(wallet.address, statement);
            const prepared = siweMessage.prepareMessage();
            const signature = await signMessage(prepared);

            const response = await api.post(`${NEXT_PUBLIC_API_URL}/user/signin`, {
                username: formUsername,
                address: wallet.address,
                message: prepared,
                signature,
            });

            if (response.data.success) {
                setIsLoading(false)
                const accessToken = response.data.accessToken;
                setAccessToken(accessToken);
                // Cookies.set('access_token', response.data.accessToken, {expires: 1 / 24});
                setIsAuthenticated(true);
                await fetchAndSetProfile(accessToken);
                await router.push('/profile/me')

            } else {
                setError('Sign-in failed: ' + response.data.message);
            }
        } catch (err: any) {
            setError(`Error during sign-in: ${err?.code} - ${err?.response?.data?.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const onConnectMetamaskClick = async () => {
        try {
            await connect();
        } catch (err) {
            setError('Error connecting to MetaMask');
            console.error(err);
        }
    };

    const onLogoutClick = async () => {
        await clearWeb3Context();
        setIsAuthenticated(false);
        clearProfile()
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-b p-4 text-black">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
                <h1 className="text-xl font-bold text-center">Sign In</h1>

                <div>
                    <input
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        type="text"
                        placeholder="Username"
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value)}
                    />
                </div>

                <div className="text-sm text-gray-600">Wallet Address: {wallet?.address}</div>

                {wallet?.address ? (
                    <div className="space-y-2">
                        <button
                            className={`w-full px-4 py-2 font-bold text-black bg-indigo-600 rounded hover:bg-indigo-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleSignIn}
                        >
                           Sign In
                        </button>
                        <button
                            className="w-full px-4 py-2 font-bold text-black bg-red-600 rounded hover:bg-red-500"
                            onClick={onLogoutClick}
                        >
                            Disconnect Metamask
                        </button>
                    </div>
                ) : (
                    <button
                        className="w-full px-4 py-2 font-bold text-black bg-green-600 rounded hover:bg-green-500"
                        onClick={onConnectMetamaskClick}
                    >
                        Connect MetaMask
                    </button>
                )}

                {error && <div className="text-red-500">{error}</div>}
            </div>
        </div>

    );
};

export default AuthSignInPage;
