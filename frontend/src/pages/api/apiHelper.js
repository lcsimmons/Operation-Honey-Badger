import axios from 'Axios';


export const loginUser = async (body) => {
    const host = process.env['HOST'] || "http://127.0.0.1:5000";

    const url =  host + '/api/login';

    let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          }
        }

    try{
        const res = await axios.post(url, body, config);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 