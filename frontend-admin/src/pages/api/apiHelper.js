import axios from 'axios';

const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export const getCommonExploits = async () => {
  try {
      const res = await axios.get(`${apiHost}/soc-admin/dashboard/common_exploits`);
      return res;
  } catch (err) {
      console.log("Error fetching common exploits:", err);
      return err.response;
  }
};

export const getAttackerIP = async () => {
    try {
      const res = await axios.get(`${apiHost}/soc-admin/dashboard/attacker_ip`);
      return res.data;
    } catch (err) {
      console.error("Error fetching attacker IP data:", err);
      return null;
    }
};

export const getAttackerOS = async () => {
    try {
        const res = await axios.get(`${apiHost}/soc-admin/dashboard/attacker_os`);
        return res.data;
    } catch (err) {
        console.error("Error fetching attacker OS data:", err);
        return null;
    }
};

export const getPagesTargeted = async () => {
  try {
    const res = await axios.get(`${apiHost}/soc-admin/dashboard/pages_targeted`);
    // Sort by count in descending order
    if (res.data && Array.isArray(res.data)) {
      res.data.sort((a, b) => b.count - a.count);
    }
    return res.data;
  } catch (err) {
    console.error("Error fetching pages targeted data:", err);
    return null;
  }
};

export const getBrowsersUsed = async () => {
  try {
    const res = await axios.get(`${apiHost}/soc-admin/dashboard/attacker_browser`);
    // Sort by count in descending order
    if (res.data && Array.isArray(res.data)) {
      res.data.sort((a, b) => b.count - a.count);
    }
    return res.data;
  } catch (err) {
    console.error("Error fetching browsers used data:", err);
    return null;
  }
};
  
export const getEngagementTime = async (attackerId = null) => {
    const param = attackerId ? `?attacker_id=${attackerId}` : "";
    try {
      const res = await axios.get(`${apiHost}/soc-admin/dashboard/total_attacker_engagement${param}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching engagement time:", err);
      return null;
    }
};

export const getEngagementTimeByAttacker = async (attackerId = null) => {
  const param = attackerId ? `?attacker_id=${attackerId}` : "";
  try {
    const res = await axios.get(`${apiHost}/soc-admin/dashboard/attacker_engagement${param}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching engagement time:", err);
    return null;
  }
};
  

