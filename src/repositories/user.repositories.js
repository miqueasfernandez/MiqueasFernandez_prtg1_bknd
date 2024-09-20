import UserDao from "../dao/user.dao.js";

class userRepositories {

    async createUser(userdata) {
        return await UserDao.save(userdata);
    }

    async getUserById(id) {
        return await UserDao.findById(id);
    }

    async getUserByUsername(usuario) {
        return await UserDao.findOne({ usuario });
    }
}

export default new userRepositories()