import axios from "axios";

class API {
  constructor() {}

  async getSafeties(cancelToken) {
    return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/safety-grouping-items`, { cancelToken });
  }

  async addItem(data, cancelToken) {
    return await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item`, { data, cancelToken });
  }

  async setItem(id, data, cancelToken) {
    return await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item/${id}`, { data, cancelToken });
  }

  async removeItem(data, cancelToken) {
    return await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/safety-item`, { data, cancelToken });
  }
}

const Api = new API();

export default Api;
