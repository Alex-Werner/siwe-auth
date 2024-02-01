'use client';
import React, {useContext} from "react";
import ProfileContext from "@/context/ProfileContext";
import fetchSelfProfile from "./methods/fetchSelfProfile";
import AuthContext from "@/context/AuthContext";

export function ProfileProvider({children}: { children: React.ReactNode }) {
    const loadProfileFromStorage = () => {
        if(typeof window === 'undefined') return null;
        const storedProfile = localStorage.getItem('profile');
        return storedProfile ? JSON.parse(storedProfile) : null;
    };

    const initialProfile = loadProfileFromStorage() || {
        username: "", address: "", id: "", role: ""
    };

    const [username, setUsername] = React.useState<string>(initialProfile.username);
    const [address, setAddress] = React.useState<string>(initialProfile.address);
    const [id, setId] = React.useState<string>(initialProfile.id);
    const [role, setRole] = React.useState<string>(initialProfile.role);


    const { accessToken } = useContext(AuthContext);

    async function fetchAndSetProfile(accessToken?: string) {
        if(!accessToken) return;
        const profile = await fetchSelfProfile(accessToken)
        setProfile(profile);
    }

    function clearProfile() {
        setUsername("");
        setAddress("");
        setId("");
        setRole("");
        localStorage.removeItem('profile');
    }
    function setProfile(profile: any) {
        if(!profile) return;
        setUsername(profile.username);
        setAddress(profile.address);
        setId(profile.id);
        setRole(profile.role);
        localStorage.setItem('profile', JSON.stringify(profile));
    }


    const exportedValue = {
        username, address, id, role,
        setUsername, setAddress, setId, setRole,
        setProfile, clearProfile, fetchSelfProfile,
        fetchAndSetProfile
    };

    return (
        <ProfileContext.Provider value={{...exportedValue}}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;
