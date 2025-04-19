import axios from 'axios';

const apiHost = process.env.NEXT_PUBLIC_API_HOST;

export const getCommonExploits = async () => {
    const host = apiHost || "http://127.0.0.1:5000";
    const url = host + "/soc-admin/dashboard/common_exploits";

    try {
        const res = await axios.get(url);
        return res;
    } catch (err) {
        console.log("Error fetching common exploits:", err);
        return err.response;
    }
};
