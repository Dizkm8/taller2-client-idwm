import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
};

const Auth = {
  login: (form: {}) => requests.post("auth/login", form),
};

const agent = { Auth };

export default agent;
