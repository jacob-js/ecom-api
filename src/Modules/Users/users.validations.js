import { Op } from 'sequelize';
import db from '../../db/models';
import { sendResponse } from '../../Utils/helpers';

const yup = require('yup');

export const schema = yup.object({
    fullname: yup.string().required("Le nom complet est requis"),
    email: yup.string().email("L'email n'est pas valide"),
    password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
                .required("Le mot de passe est requis").matches(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
                .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    country: yup.string(),
    state: yup.string(),
    city: yup.string(),
    birthdate: yup.date(),
    phone: yup.string().required("Le numéro de téléphone est requis")
                        .matches(/^[+243]/, "Le numéro de téléphone doit commencer avec +243"),
    confirmPassword: yup.string().when('password', {
        is: (password) => password && password.length >= 6 && password.match(/[a-zA-Z]/) && password.match(/[0-9]/),
        then: yup.string().required('Veuillez confirmer le mot de passe').oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
    }),
    gender: yup.string(),
    profession: yup.string()
})

export const loginSchema = yup.object({
    username: yup.string().required("L'identifiant est requis"),
    password: yup.string().required("Le mot de passe est requis")
})

export const verifySchema = yup.object({
    token: yup.string().required("Le token est requis"),
    code: yup.string().required("Le code est requis")
})

export const adminSchema = yup.object({
    username: yup.string().required("L'identifiant est requis"),
    role: yup.string().required("Le rôle est requis"),
    permissions: yup.array().nullable()
})

export const checkEmailExist = async(req, res, next) =>{
    const { email } = req.body;
    const user = await db.Users.findOne({ where: { email } });
    if(user){
        return sendResponse(res, 409, "L'email existe déjà", null);
    }else{
        next();
    }
}

export const checkPhoneExist = async(req, res, next) =>{
    const { phone } = req.body;
    const user = await db.Users.findOne({ where: { phone } });
    if(user){
        return sendResponse(res, 409, "Le numéro de téléphone existe déjà", null);
    }else{
        next();
    }
}

export const checkUpdatePhoneExist = async(req, res, next) =>{
    const { phone } = req.body;
    if(phone){
        const user = await db.Users.findOne({ where: { phone } });
        if(user && user.id !== req.params.id){
            return sendResponse(res, 409, "Le numéro de téléphone existe déjà", null);
        }else{
            next();
        }
    }else{
        next();
    }
}

export const checkUpdateEmailExist = async(req, res, next) =>{
    const { email } = req.body;
    if(email){
        const user = await db.Users.findOne({ where: { email } });
        if(user && user.id !== req.params.id){
            return sendResponse(res, 409, "L'email existe déjà", null);
        }else{
            next();
        }
    }else{ next() }
}

export const checkAdminExist = async(req, res, next) =>{
    const { username } = req.body;
    const user = await db.Users.findOne({ where: {
        [Op.or]: [{ email: username }, { phone: username }]
    } });
    if(user){
        const admin = await db.Admins.findOne({ where: { userId: user.id } });
        if(admin){
            return sendResponse(res, 409, "L'administrateur existe déjà", null);
        }
        req.toAdmin = user;
        return next();
    }else{
        return sendResponse(res, 404, "Utilisateur non trouvé");
    }
}