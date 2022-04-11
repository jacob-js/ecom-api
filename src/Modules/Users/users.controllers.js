import { Op } from "sequelize";
import db from "../../db/models";
import { createToken } from "../../Utils/auth.utils";
import { comparePassword, hashPassword, sendResponse } from "../../Utils/helpers";
import { uploadProductImage } from "../../Utils/imageUpload.util";
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
                [Op.or]: [{ email: username }, { phone: username }]
            } });
            if (!user) return sendResponse(res, 401, "Utilisateur ou mot de passe incorrect");
            if(!user.isVerified) return sendResponse(res, 401, "Veuillez vérifier votre compte", { isVerified: false });
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
    async adminLogin(req, res){
        const { username, password } = req.body;
        try {
            const user = await db.Users.findOne({ where: {
                [Op.or]: [{ email: username }, { phone: username }],
            } });
            if (!user) return sendResponse(res, 401, "Utilisateur ou mot de passe incorrect");
            if(!user.isVerified) return sendResponse(res, 401, "Veuillez vérifier votre compte", { isVerified: false });
            const isMatch = comparePassword(password, user.password);
            if(isMatch) {
                const admin = await db.Admins.findOne({ where: { userId: user.id } });
                if(admin){
                    const token = createToken(user.id);
                    return sendResponse(res, 200, "Connexion réussie", { user, token });
                }else{
                    return sendResponse(res, 401, 'Accès refusé')
                }
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
                await user.update({ isVerified: true, otp: null });
                return sendResponse(res, 200, "Votre compte a été vérifié", user);
            }else{
                return sendResponse(res, 401, "Code de vérification incorrect");
            }
        }else{
            return sendResponse(res, 401, "Utilisateur non trouvé");
        }
    },

    createAdmin: async(req, res) =>{
        const user = req.toAdmin;
        const admin = await db.Admins.create({ userId: user.id });
        const data = { ...admin.dataValues, User: user }
        return sendResponse(res, 200, "Admin créé", data);
    },

    getAdmins: async(req, res) =>{
        const admins = await db.Admins.findAll({
            include: 'User'
        });
        return sendResponse(res, 200, "Liste des admins", admins);
    },

    async getCurrent(req, res){
        const user = await db.Users.findOne({ where: { id: req.user.id } });
        return sendResponse(res, 200, "Utilisateur", user);
    },

    async sendVerificationCode(req, res){
        const {username} = req.params;
        const user = await db.Users.findOne({ where: {
            [Op.or]: [{ email: username }, { phone: username }]
        } });
        if(!user){ return sendResponse(res, 404, "Utilisateur non trouvé"); }
        if(user.isVerified){ return sendResponse(res, 200, "Utilisateur déjà vérifié"); }
        const code = Math.floor(Math.random() * (100000 - 10000) + 10000);
        await user.update({ otp: code });
        sendVerificationCode(user, code);
        if(user.phone){
            sendSms(user.phone, `Votre code de vérification est ${code}`);
        }
        return sendResponse(res, 200, "Code de vérification envoyé", user);
    },

    async userDetails(req, res){
        const { id } = req.params;
        const { method } = req;
        const user = await db.Users.findOne({ where: { id } });
        if(!user){ return sendResponse(res, 404, "Utilisateur non trouvé"); }
        if(method === "GET"){
            return sendResponse(res, 200, "Utilisateur", user);
        }else if(method === "PUT"){
            let cover;
            if(req.files){
                cover = await uploadProductImage(req, 'cover');
            }
            await user.update({...req.body, cover: cover || user.cover});
            return sendResponse(res, 200, "Utilisateur modifié", user);
        }else if(method === "DELETE"){
            await user.destroy();
            return sendResponse(res, 200, "Utilisateur supprimé");
        }else{
            return sendResponse(res, 404, "Méthode non trouvée");
        }
    },

    async getUsers(req, res){
        const { limit, offset } = req.query;
        const users = await db.Users.findAndCountAll({
            attributes: { exclude: ['password', 'otp'] },
            limit: parseInt(limit) || 10,
            offset: parseInt(offset) || 0,
            order: [['createdAt', 'DESC']]
        });
        return sendResponse(res, 200, "Liste des utilisateurs", users);
    }
};

export default usersController;