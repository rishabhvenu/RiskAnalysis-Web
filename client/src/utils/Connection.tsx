import axios from "axios";

class Connection {
  static async isLoggedIn() {
    return (
      await axios.get(`${import.meta.env.VITE_BASE_URL}/session`, {
        withCredentials: true,
      })
    ).data.username;
  }
}

export default Connection;
