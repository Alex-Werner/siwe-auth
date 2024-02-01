import api from "@/lib/http";

const fetchProfileById = async (id: string) => {
    if(!id) {
        throw new Error('Profile ID is required for fetching profile');
    }
    const response = await api.get(`/user/profile/${id}`);
    return response.data;
}

export default fetchProfileById;
