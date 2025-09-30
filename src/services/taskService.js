import createApiInstance from "./apiConfig";

const api = createApiInstance();

export const taskService = {
  getAllTasksByOwner: async () => {
    const response = await api.get("/task/by-owner");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/task/create", taskData);
    return response.data;
  },

  updateTask: async (taskId, updateData) => {
    const response = await api.post("/task/update", { taskId, ...updateData });
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.post("/task/delete", { taskId });
    return response.data;
  },

  getTasksByEmployee: async (employeeId) => {
    try {
      const response = await api.get("/task/by-employee", { employeeId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await api.put("/task/update-status", { taskId, status });
    return response.data;
  },
};

export default taskService;
