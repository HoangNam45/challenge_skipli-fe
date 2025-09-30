import createApiInstance from "./apiConfig";

const api = createApiInstance();

export const employeeService = {
  loginEmail: async (email) => {
    const response = await api.post("/employee/login-email", { email });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post("/employee/login", {
      username,
      password,
    });
    return response.data;
  },

  validateAccessCode: async (email, accessCode) => {
    const response = await api.post("/employee/validate-access-code", {
      email,
      accessCode,
    });
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await api.get("/employee/verify-token", {
      params: { token },
    });
    return response.data;
  },

  accountSetup: async (token, username, password) => {
    const response = await api.post("/employee/account-setup", {
      token,
      username,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/employee/get-profile");
    return response.data;
  },

  updateProfile: async (name, phone) => {
    const response = await api.put("/employee/update-profile", { name, phone });
    return response.data;
  },
};

export default employeeService;
