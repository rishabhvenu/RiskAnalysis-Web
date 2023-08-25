import axios from "axios";

class Connection {
  static async isLoggedIn() {
    return (
      await axios.get("http://localhost:5050/session", {
        withCredentials: true,
      })
    ).data.username;
  }
}

export default Connection;
