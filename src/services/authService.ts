import axios from "axios";

const getUserData = async (): Promise<any> => {
    try {
        const response = await axios.get(import.meta.env.VITE_AUTH_ME, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data; 
    } catch(error) {
        console.log('Error fetching user data', error);
        return null;
    }
}

export {getUserData};
