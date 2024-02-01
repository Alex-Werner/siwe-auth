'use client';
import { useContext } from "react";
import ProfileContext from "@/context/ProfileContext";
import Cookies from "js-cookie";

const ProfileMePage = () => {

    const { username, address, id, role,fetchAndSetProfile } =  useContext(ProfileContext);

    const onRefreshProfileClick = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            await fetchAndSetProfile(accessToken);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-b p-4 text-black">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow">
                <h1 className="text-xl font-bold text-center">My Profile</h1>

                <div className="space-y-1">
                    <div><strong>Id:</strong> {id}</div>
                    <div><strong>Username:</strong> {username}</div>
                    <div><strong>Address:</strong> {address}</div>
                    <div><strong>Role:</strong> {role}</div>
                </div>

                <div className="space-y-2">
                    <button
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-500"
                        onClick={onRefreshProfileClick}
                    >
                        Force Refresh Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileMePage;
