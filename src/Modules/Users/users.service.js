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

    async resetPassword(userId, newPassword){
        const password = hashPassword(newPassword);
        await this.model.upate({ password: password }, { where: { id: userId } })
    }
};

export default new UsersService;