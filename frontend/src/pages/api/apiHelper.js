import axios from 'Axios';

const apiHost = process.env.NEXT_PUBLIC_API_HOST;

export const loginUser = async (body) => {
    const host = apiHost || "http://127.0.0.1:5000";

    console.log(apiHost)

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

//not implemented yet on the backend
export const getForumComments = async (queryParams=null) => {
    //host should be something like https://cs412abhinavnallam:5000
    //follow this string to make the queryParams https://www.geeksforgeeks.org/how-to-create-query-parameters-in-javascript/
    const host = apiHost || "http://127.0.0.1:5000";
    const params = queryParams || ""

    const url =  host + '/api/forum/comments?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 

//connor implemented yet in the backend
export const getEmployees = async (queryParams=null) => {
    //host should be something like https://cs412abhinavnallam:5000
    //follow this string to make the queryParams https://www.geeksforgeeks.org/how-to-create-query-parameters-in-javascript/
    const host = apiHost || "http://127.0.0.1:5000";

    const params = queryParams || ""

    const url =  host + '/api/admin/employees?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 

export const getExpenses = async (queryParams=null) => {
    //host should be something like https://cs412abhinavnallam:5000
    //follow this string to make the queryParams https://www.geeksforgeeks.org/how-to-create-query-parameters-in-javascript/
    const host = apiHost || "http://127.0.0.1:5000";
    const params = queryParams || ""

    const url =  host + '/api/admin/reimbursement?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 


export const getITTickets  = async (queryParams) => {
    const host = apiHost || "http://127.0.0.1:5000";

    const params = queryParams || ""
    const url =  host + '/api/admin/it_support?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 

export const getPerformanceData = async (queryParams) => {
    const host = apiHost || "http://127.0.0.1:5000";
    const params = queryParams || ""

    const url =  host + '/api/admin/performance_analytics?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 

export const getCorporateProjects = async (queryParams) => {
    const host = apiHost || "http://127.0.0.1:5000";

    const params = queryParams || ""
    const url =  host + '/api/admin/corporate_initiatives?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 