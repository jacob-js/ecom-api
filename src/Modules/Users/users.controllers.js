import { Op } from "sequelize";
import db from "../../db/models";
import { createResetPwdToken, createSignupToken, createToken, createUpdatePwdToken, decodeResetPwdToken, decodeSignupToken } from "../../Utils/auth.utils";
import { comparePassword, hashPassword, sendResponse } from "../../Utils/helpers";
import { uploadProductImage } from "../../Utils/imageUpload.util";
import { sendCode } from "../../Utils/nodemailer";
import { getGoogleUser } from "../../Utils/oauth.google";
import { sendSms } from "../../Utils/sms";
import UsersService from "./users.service";

const usersController = {
    signup: async (req, res) => {
        const { password, phone, email, fullname } = req.body;
        const hash = hashPassword(password);
        const code = Math.floor(Math.random() * (100000 - 10000) + 10000);
        const token = createSignupToken({...req.body, password: hash}, code);
        sendSms(phone, `Votre code de confirmation est ${code} valide pendant 5 minutes`);
        sendCode({ fullname, email }, code);
        return sendResponse(res, 200, "Code de vérification envoyé", { token });
    },

    async validateAndCreateUser(req, res){
        const { token, code } = req.body;
        const userData = await decodeSignupToken(token, code)
        if(userData){
            const user = await db.Users.create({ ...userData });
            const token = createToken(user.id);
            return sendResponse(res, 201, "Inscription réussie", { user, token });
        }else{
            return sendResponse(res, 403, "Le code de vérification est invalide");
        }
    },

    login: async(req, res) =>{
        const { username, password } = req.body;
        try {
            const user = await UsersService.getByUsername(username);
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
    async adminLogin(req, res){
        const { username, password } = req.body;
        try {
            const user = await UsersService.getByUsername(username);
            if (!user) return sendResponse(res, 401, "Utilisateur ou mot de passe incorrect");
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

    createAdmin: async(req, res) =>{
        const user = req.toAdmin;
        const admin = await db.Admins.create({ userId: user.id, ...req.body });
        const data = { ...admin.dataValues, User: user }
        return sendResponse(res, 201, "Admin créé", data);
    },

    getAdmins: async(req, res) =>{
        const admins = await db.Admins.findAll({
            include: 'User'
        });
        return sendResponse(res, 200, "Liste des admins", admins);
    },

    async adminDetail(req, res){
        const { id } = req.params;
        const { method } = req;
        const admin = await db.Admins.findOne({ where: { id }, include: 'User' });
        if(!admin) return sendResponse(res, 404, "Admin non trouvé");
        if(method === "GET") return sendResponse(res, 200, "Admin trouvé", admin);
        else if(method === "DELETE"){
            await admin.destroy();
            return sendResponse(res, 200, "Admin supprimé");
        }else if(method === "PUT"){
            await admin.update({ ...req.body });
            return sendResponse(res, 200, "Admin modifié", admin);
        }else return sendResponse(res, 409, "Méthode non trouvée");
    },

    async getCurrent(req, res){
        const user = await db.Users.findOne({ where: { id: req.user.id } });
        return sendResponse(res, 200, "Utilisateur", user);
    },

    async resetPassword(req, res){
        const { method } = req;
        const {phone, email} = req.query;
        if(method === 'GET'){
            const user = await UsersService.getByUsername(phone || email);
            if(!user){ return sendResponse(res, 200, "Code de confirmation envoyé"); }
            const code = Math.floor(Math.random() * (100000 - 10000) + 10000);
            const token = createResetPwdToken(user.id, code);
            if(phone){
                sendSms(user.phone, `Votre code de confirmation est : ${code}`)
            }
            if(email){
                sendCode(user, code)
            }
            return sendResponse(res, 200, "Code de confirmation envoyé", { token, user })
        }else if(method === 'POST'){
            const {token, code} = req.body;
            const userId = await decodeResetPwdToken(token, code);
            if(userId){
                const updatePwdToken = createUpdatePwdToken(userId);
                return sendResponse(res, 200, null, { updatePwdToken });
            }else{
                return sendResponse(res, 403, "Le code de vérification est invalide");
            }
        }else if(method === 'PUT'){
            const user = await UsersService.getUserById(req.userId);
            if(!user){ return sendResponse(res, 404, "Impossible de modifier le mot de passe"); };
            const { newPwd } = req.body;
            await UsersService.resetPassword(req.userId, newPwd);
            return sendResponse(res, 200, "Mot de passe moifié", user)
        }
        return sendResponse(res, 405, "Methode non supportée");
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
            console.log('body', req.body)
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