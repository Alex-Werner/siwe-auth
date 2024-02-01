'use client';
import {useContext} from "react";
import Web3Context from "@/context/Web3Context";
import AuthContext from "@/context/AuthContext";
import Cookies from "js-cookie";
import ProfileContext from "@/context/ProfileContext";

const AuthLogoutPage = () => {

    const {clearWeb3Context} = useContext(Web3Context);
    const {clearAuthContext} = useContext(AuthContext);
    const {clearProfile} = useContext(ProfileContext);

    function onLogOutButtonClick() {
        clearWeb3Context();
        clearProfile();
        clearAuthContext();
        // Redirect to home page
        window.location.href = "/";
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-b p-4 text-black">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
                <h1 className="text-xl font-bold text-center">Logout</h1>
                <div className="space-y-2">
                    <button
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-500"
                        onClick={onLogOutButtonClick}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthLogoutPage;
