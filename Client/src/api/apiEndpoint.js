const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/users/get",
  },
  USER: {
    GET_PROFILE: "/users/get",
    UPDATE_PROFILE: "/users/update",
  },
  DASHBOARD: {
    GET_DASHBOARD: "/dashboard",
  },
  CATEGORIES: {
    CREATE: "/categories/create",
    UPDATE: "/categories/update/:id",
    DELETE: "/categories/delete/:id",
    GET_ALL: "/categories/getAll",
    GET_ONE: "/categories/get/:id",
  },
};

export default API_ENDPOINTS;
