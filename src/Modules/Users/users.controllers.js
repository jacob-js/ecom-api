import { Op } from "sequelize";
import db from "../../db/models";
import { createToken } from "../../Utils/auth.utils";
import { comparePassword, hashPassword, sendResponse } from "../../Utils/helpers";
import { sendVerificationCode } from "../../Utils/nodemailer";
import { getGoogleUser } from "../../Utils/oauth.google";
import { sendSms } from "../../Utils/sms";

const usersController = {
    signup: async (req, res) => {
        const { password } = req.body;
        const hash = hashPassword(password);
        const code = Math.floor(Math.random() * (100000 - 10000) + 10000);
        const user = await db.Users.create({ ...req.body, password: hash, otp: code });
        const token = createToken(user.id);
        sendVerificationCode(user, code);
        sendSms(user.phone, `Votre code de vérification est ${code}`);
        return sendResponse(res, 200, "Inscription réussie", { user, token });
    },

    login: async(req, res) =>{
        const { username, password } = req.body;
        try {
            const user = await db.Users.findOne({ where: {
                [Op.or]: [{ email: username }, { phone: username }], isVerified: true
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
    },
    googleLogin: async(req, res) =>{
        const {googleToken} = req.body;
        try {
            const gUser = await getGoogleUser(googleToken);
            if(gUser.email){
                const user = await db.Users.findOne({ where: { email: gUser.email } });
                if(user){
                    const token = createToken(user.id);
                    return sendResponse(res, 200, "Connexion réussie", { user, token });
                }else{
                    const user = await db.Users.create({
                        fullname: gUser.fullname,
                        email: gUser.email,
                        password: "",
                        authProvider: "google",
                        isVerified: true
                    });
                    return sendResponse(res, 200, "Connexion réussie", { user, token: createToken(user.id) });
                }
            }else{
                return sendResponse(res, 500, "Erreur interne");
            }
        } catch (error) {
            return sendResponse(res, 401, {error});
        }
    },

    verify: async(req, res) =>{
        const { code, username } = req.body;
        const user = await db.Users.findOne({ where: {
            [Op.or]: [{ email: username }, { phone: username }], isVerified: false
        } }); 
        if(user){
            if(user.otp == code){
                await user.update({ isVerified: true });
                return sendResponse(res, 200, "Votre compte a été vérifié", user);
            }else{
                return sendResponse(res, 401, "Code de vérification incorrect");
            }
        }else{
            return sendResponse(res, 401, "Utilisateur non trouvé");
        }
    }
};

export default usersController;