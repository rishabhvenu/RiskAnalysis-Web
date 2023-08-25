import mongoose from "mongoose";
import User from "./models/User";
import bcrypt from "bcrypt";

class Database {
  constructor(url) {
    mongoose.connect(url);
  }

  createUser(username, password, email) {
    new User({ username: username, password: password, email: email }).save();
  }

  async getUsernameSchema(username) {
    return await this.find("username", username);
  }

  async getEmailSchema(email) {
    return await this.find("email", email);
  }

  hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        resolve(hash);
      });
    });
  }

  async authenticateLogin(username, email, password) {
    let schema;

    if (username) {
      schema = await this.getUsernameSchema(username);
    } else {
      schema = await this.getEmailSchema(email);
    }

    return schema ? await bcrypt.compare(password, schema.password) : false;
  }

  private async find(field, variable) {
    const option = {};
    option[field] = {"$regex": `^${variable}$`, "$options" : "i"};

    return await User.findOne(option);
  }
}

export default Database;
