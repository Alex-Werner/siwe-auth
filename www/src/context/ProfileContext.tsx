'use client';
import {createContext} from "react";

export interface Profile {
    name: string;
    email: string;
    id: string;
    role: string;
}
export interface ProfileContextInterface {
    username: string;
    address: string;
    id: string;
    role: string;
    setProfile: (profile: any) => void;
    clearProfile: () => void;
    fetchSelfProfile: (accessToken: string) => Promise<Profile | null>;
    fetchAndSetProfile: (accessToken?: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextInterface>({
    username: "",
    address: "",
    id: "",
    role: "",
    setProfile: (profile: any) => {},
    clearProfile: () => {},
    fetchSelfProfile: async (accessToken: string) => {
        return null;
    },
    fetchAndSetProfile: async (accessToken?: string) => {},
});

export default ProfileContext;
