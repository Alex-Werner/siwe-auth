'use client';
import {useContext, useState} from "react";
import AuthContext from "@/context/AuthContext";
import Web3Context from "@/context/Web3Context";
import api from "@/lib/http";
import {useRouter} from "next/navigation";

const AuthSignUpPage = () => {
    const router = useRouter();

    const {createSiweMessage, setIsAuthenticated} = useContext(AuthContext);
    const {connect, clearWeb3Context, wallet, signMessage} = useContext(Web3Context);
    const [isLoading, setIsLoading] = useState(false);

    const [formUsername, setFormUsername] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const verifySiweMessage = async (message: string, signature:string) => {
        try {
            if(!wallet?.address){
                setError('Wallet is not connected');
                return;
            }
            const response = await api.post('/siwe/verify', {
                message, signature, address: wallet?.address, username: formUsername,
            });
            return response.data;
        } catch (err) {
            setError('Error verifying Siwe message');
            console.error(err);
        }
    };

    const onCreateSiweMessageButtonClick = async () => {
        setIsLoading(true);
        try {
            if(!wallet?.address){
                setError('Wallet is not connected');
                return;
            }
            const siweMessage = await createSiweMessage(wallet?.address);
            const prepared = siweMessage.prepareMessage();
            const signature = await signMessage(prepared);
            // Allow to verify before consuming the nonce
            const verify = await verifySiweMessage(prepared, signature);

            if (verify?.success) {
                const response = await api.post('/user/signup', {
                    // @ts-ignore
                    message: prepared,
                    signature,
                    username: formUsername,
                    address: wallet.address,
                });
                const result = response.data;
                if (result.id) {
                    setSuccess('Signup successful');
                    setIsAuthenticated(true);
                    router.push("/profile/me");
                } else {
                    setError('Signup failed' + result.message);
                }
            } else {
                setError('Siwe message verification failed');
            }
        } catch (err: any) {
            setError(`Error during sign-up: ${err?.code} - ${err?.response?.data?.message}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const onConnectMetamaskClick = async () => {
        try {
            await connect();
            setIsAuthenticated(true);
        } catch (err) {
            setError('Error connecting to Metamask');
            console.error(err);
        }
    };

    const onLogoutClick = async () => {
        await clearWeb3Context();
        setIsAuthenticated(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-b p-4 text-black">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
                <h1 className="text-xl font-bold text-center">Sign Up</h1>

                <div>{wallet?.address}</div>
                {wallet?.address ? (
                    <>
                        <div>
                            <input
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                type="text"
                                placeholder="Enter your desired username"
                                value={formUsername}
                                onChange={(e) => setFormUsername(e.target.value)}
                            />
                        </div>
                        {formUsername && (
                            <button onClick={onCreateSiweMessageButtonClick} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Sign up with Ethereum'}
                            </button>
                        )}


                        <button onClick={onLogoutClick}>Logout</button>
                    </>
                ) : (
                    <button onClick={onConnectMetamaskClick}>
                        Connect Metamask
                    </button>
                )}
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
            </div>
        </div>
    );
};

export default AuthSignUpPage;
