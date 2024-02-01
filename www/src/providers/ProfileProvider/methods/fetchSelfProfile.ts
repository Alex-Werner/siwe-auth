import api from "@/lib/http";

const fetchSelfProfile = async (accessToken: string) => {
    const response = await api.get('/user/profile');
    return response.data;
}

export default fetchSelfProfile;
