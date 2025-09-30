import createApiInstance from "./apiConfig";

const api = createApiInstance();

export const ownerService = {
  createAccessCode: async (phoneNumber) => {
    const response = await api.post("/owner/create-access-code", {
      phoneNumber,
    });
    return response.data;
  },

  validateAccessCode: async (phoneNumber, accessCode) => {
    const response = await api.post("/owner/validate-access-code", {
      phoneNumber,
      accessCode,
    });
    return response.data;
  },

  getAllEmployees: async () => {
    const response = await api.get("/owner/get-all-employees");
    return response.data;
  },

  createEmployee: async (employeeData) => {
    console.log("Creating employee with data:", employeeData);
    const response = await api.post("/owner/create-employee", employeeData);
    return response.data;
  },

  getEmployee: async (employeeId) => {
    const response = await api.post("/owner/get-employee", { employeeId });
    return response.data;
  },

  deleteEmployee: async (employeeId) => {
    const response = await api.post("/owner/delete-employee", { employeeId });
    return response.data;
  },

  updateEmployee: async (updateData) => {
    console.log("Updating employee with data:", updateData);
    const response = await api.post("/owner/update-employee", updateData);
    return response.data;
  },
};

export default ownerService;
