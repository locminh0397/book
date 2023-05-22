import axiosClient from "./axiosClient";

const publisherApi = {
  getAll: ({ page, limit }) => {
    const url = "publishers/";
    return axiosClient.get(url, { params: { page, limit } });
  },

  create: ({ name }) => {
    const url = "publishers/";
    return axiosClient.get(url, { data: { name } });
  },
};

export default publisherApi;
