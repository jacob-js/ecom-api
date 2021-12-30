import { Op } from 'sequelize';
import db from '../../db/models';
import { sendResponse } from '../../Utils/helpers';

const yup = require('yup');

export const schema = yup.object({
    fullname: yup.string().required("Le nom complet est requis"),
    email: yup.string().email("L'email n'est pas valide").required("L'email est requis"),
    password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
                .required("Le mot de passe est requis").matches(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
                .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    country: yup.string().required("Le pays est requis"),
    state: yup.string().required("La province est requise"),
    // city: yup.string().required("La ville est requise"),
    // birthdate: yup.date().required("La date de naissance est requise"),
    phone: yup.string().required("Le numéro de téléphone est requis")
                        .matches(/^[+243]/, "Le numéro de téléphone doit commencer avec +243"),
    confirmPassword: yup.string().when('password', {
        is: (password) => password && password.length >= 6 && password.match(/[a-zA-Z]/) && password.match(/[0-9]/),
        then: yup.string().required('Veuillez confirmer le mot de passe').oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
    }),
    // gender: yup.string().required('Le sexe est requis'),
    profession: yup.string().required('La profession est requise')
})

export const loginSchema = yup.object({
    username: yup.string().required("L'identifiant est requis"),
    password: yup.string().required("Le mot de passe est requis")
})

export const verifySchema = yup.object({
    username: yup.string().required("L'identifiant est requis"),
    code: yup.number().required("Le code est requis")
})

export const adminSchema = yup.object({
    username: yup.string().required("L'identifiant est requis")
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

export const checkAdminExist = async(req, res, next) =>{
    const { username } = req.body;
    const user = await db.Users.findOne({ where: {
        [Op.or]: [{ email: username }, { phone: username }], isVerified: true
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