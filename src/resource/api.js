import axios from "axios";

class API {
  $axios;
  constructor() {
    this.$axios = axios.create({
      withCredentials: true,
    });
  }

  async login(data, cancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { data, cancelToken });
  }

  async getSafeties(cancelToken) {
    return await this.$axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/safety-grouping-items`, { cancelToken });
  }

  async addGroup(cancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group`, { cancelToken });
  }

  async setGroup(id, data, cancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group/${id}`, { data, cancelToken });
  }

  async removeGroup(id, cancelToken) {
    return await this.$axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/safety-group/${id}`, { cancelToken });
  }

  async addItem(data, cancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item`, { data, cancelToken });
  }

  async setItem(id, data, cancelToken) {
    return await this.$axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item/${id}`, { data, cancelToken });
  }

  async removeItem(id, cancelToken) {
    return await this.$axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item/${id}`, { cancelToken });
  }
}

const Api = new API();

export default Api;
