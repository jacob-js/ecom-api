import jwt from "jsonwebtoken";

export const createToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1week'});
    return token;
}