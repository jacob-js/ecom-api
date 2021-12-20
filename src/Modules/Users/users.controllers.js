import db from "../../db/models";
import { createToken } from "../../Utils/auth.utils";
import { hashPassword, sendResponse } from "../../Utils/helpers";
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
    }
};

export default usersController;