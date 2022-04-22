import db from "../../db/models";
import { hashPassword } from "../../Utils/helpers";
import { Op } from 'sequelize';

class UsersService{
    model = db.Users;

    async getUserById(id){
        return await this.model.findOne({ id })
    };

    async getByUsername(username){
        return await this.model.findOne({ where: {
            [Op.or]: [{ email: username }, { phone: username }]
        } });
    };

    async resetPassword(user, newPassword){
        const password = hashPassword(newPassword);
        await user.upate({ password: password })
    }
};

export default new UsersService;