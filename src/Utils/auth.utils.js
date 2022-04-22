import jwt from "jsonwebtoken";
import db from "../db/models";
import { sendResponse } from "./helpers";

export const createToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1week'});
    return token;
};

export const verifyToken = async(req, res, next) =>{
    const token = req.headers.authorization || req.headers.bweteta_token;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await db.Users.findOne({ where: { id: decoded.userId } });
            if(user){
                req.user = user;
                next();
            }else{
                return sendResponse(res, 401, "Token invalide");
            }
        } catch (error) {
            return sendResponse(res, 401, "Token invalide");
        }
    }else{
        return sendResponse(res, 401, "Token manquant");
    }
}

export const checkIsAdmin = async(req, res, next) =>{
    const admin = await db.Admins.findOne({ where: { userId: req.user.id } });
    if(admin){
        return next();
    }
    return sendResponse(res, 401, "Vous n'avez pas les droits pour effectuer cette action");
}

export const createSignupToken = (userData, code) =>{
    const token = jwt.sign({userData, code}, process.env.JWT_SECRET, {expiresIn: '5min'});
    return token
}

export const decodeSignupToken = async(token, bodyCode) =>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.code == bodyCode){
            return decoded.userData
        }else{
            return false
        }
    } catch (error) {
        return false
    }
};

export const createResetPwdToken = (userId, code) =>{
    const token = jwt.sign({userId, code}, process.env.JWT_SECRET, {expiresIn: '5min'});
    return token
};

export const decodeResetPwdToken = async(token, bodyCode) =>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.code == bodyCode){
            return decoded.userId
        }else{
            return false
        }
    } catch (error) {
        return false
    }
};