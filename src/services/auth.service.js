import axios from "axios";

//const API_URL = "http://localhost:8080/api/auth/";
const API_URL = "http://pizzaservice.itcodesolutions.com/api/auth/";
const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  debugger;
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {debugger;
      if (response && response.data && response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data.user;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
