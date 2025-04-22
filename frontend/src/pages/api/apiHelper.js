import axios from 'axios';

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

export const getSecurityQuestions = async (username) => {
    const host = apiHost || "http://127.0.0.1:5000";

    const url =  host + '/api/security_questions';

    try{
        const res = await axios.post(url, { 
            username
        });
        return res;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const validateForgotPassword = async (username, questionId, securityAnswer) => {
    const host = apiHost || "http://127.0.0.1:5000";

    const url =  host + '/api/forgot_password';

    try{
        const res = await axios.post(url, {
            username,
            answers: [{ question_id: questionId, answer: securityAnswer }],
        });
        return res;
    }catch(err){
        console.log(err);
        throw err;
    }

}

export const processChangePassword = async (username, newPassword) => {
    const host = apiHost || "http://127.0.0.1:5000";

    const url =  host + '/api/change_password';

    try{
        const res = await axios.post(url, {
            username,
            newPassword,
        });
        return res;
    }catch(err){
        console.log(err);
        throw err;
    }
}

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

export const getForumPosts = async (queryParams=null) => {
    //host should be something like https://cs412abhinavnallam:5000
    //follow this string to make the queryParams https://www.geeksforgeeks.org/how-to-create-query-parameters-in-javascript/
    const host = apiHost || "http://127.0.0.1:5000";
    const params = queryParams || ""

    const url =  host + '/api/forum?' + params.toString();

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        return err.response
    }
} 

export const createForumPost = async (postData) => {
    const host = apiHost || "http://127.0.0.1:5000";
    const url = host + "/api/forum";

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
    };

    try {
        const res = await axios.post(url, postData, config);
        return res;
    } catch (err) {
        console.log("Error creating forum post:", err);
        return err.response;
    }
};

export const createForumComment = async (postData) => {
    const host = apiHost || "http://127.0.0.1:5000";
    const url = host + "/api/forum/comments";

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }
    };

    try {
        const res = await axios.post(url, postData, config);
        return res;
    } catch (err) {
        console.log("Error creating forum post:", err);
        return err.response;
    }
};

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

export const getSecurityLogs = async () => {
    const host = apiHost || "http://127.0.0.1:5000";

    const url =  host + '/api/admin/security_logs';

    try{
        const res = await axios.get(url);
        return res;
    }catch(err){
        console.log(err);
        throw err;
    }

}

export const apiValidateSecurityAnswer = async ({ username, questionId, securityAnswer }) => {
    const host = apiHost || "http://127.0.0.1:5000";
    const url = `${host}/api/forgot_password`;

    try {
        const res = await axios.post(url, {
            username,
            answers: [{ question_id: questionId, answer: securityAnswer }],
        });
        return res;
    } catch (err) {
        return err.response;
    }
};

export const apiSubmitNewPassword = async ({ username, newPassword }) => {
    const host = apiHost || "http://127.0.0.1:5000";
    const url = `${host}/api/change_password`;

    try {
        const res = await axios.post(url, {
            username,
            newPassword,
        });
        return res;
    } catch (err) {
        return err.response;
    }
};

export const apiFetchSecurityQuestion = async (username) => {
    const host = apiHost || "http://127.0.0.1:5000";
    const url = `${host}/api/security_questions`;
  
    try {
      const res = await axios.post(url, { username });
      return res;
    } catch (err) {
      return err.response;
    }
  };
  
