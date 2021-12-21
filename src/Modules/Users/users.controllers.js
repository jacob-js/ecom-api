import { Op } from "sequelize";
import db from "../../db/models";
import { createToken } from "../../Utils/auth.utils";
import { comparePassword, hashPassword, sendResponse } from "../../Utils/helpers";
import { sendVerificationCode } from "../../Utils/nodemailer";

const usersController = {
    signup: async (req, res) => {
        const { password } = req.body;
        const hash = hashPassword(password);
        const code = Math.floor(Math.random() * (100000 - 10000) + 10000);
        const user = await db.Users.create({ ...req.body, password: hash, otp: code });
        const token = createToken(user.id);
        sendVerificationCode(user, code);
        return sendResponse(res, 200, "Inscription réussie", { user, token });
    },

    login: async(req, res) =>{
        const { username, password } = req.body;
        try {
            const user = await db.Users.findOne({ where: {
                [Op.or]: [{ email: username }, { phone: username }]	
            } });
            if (!user) return sendResponse(res, 401, "Utilisateur ou mot de passe incorrect");
            const isMatch = comparePassword(password, user.password);
            if(isMatch) {
                const token = createToken(user.id);
                return sendResponse(res, 200, "Connexion réussie", { user, token });
            }else{
                return sendResponse(res, 401, "Utilisateur ou mot de passe incorrect");
            }
        } catch (error) {
            return sendResponse(res, 401, "Utilisateur ou mot de passe incorrect");
        }
    }
};

export default usersController;