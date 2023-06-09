import axiosClient from "./axiosClient";

const genreApi = {
  getAll: ({ page, limit }) => {
    const url = "genres/";
    return axiosClient.get(url, { params: { page, limit } });
  },
  getBySlug: (slug) => {
    const url = `genres/slug/${slug}`;
    return axiosClient.get(url);
  },

  create: (name) => {
    const url = "genres/";
    return axiosClient.get(url, { data: { name } });
  },
};

export default genreApi;
