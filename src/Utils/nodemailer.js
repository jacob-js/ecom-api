import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
        type: 'OAuth2',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    }
});

export const sendVerificationCode = async(user, code) => {
    try {
        const info = await transporter.sendMail({
            from: '"Bweteta Shopping Mall"',
            to: user.email,
            subject: ' Code de verification',
            html: `<p>Bonjour ${user.fullname},</p> <p>Votre code de verification est: ${code}</p>`
        })
    } catch (error) {
        console.log(error);        
    }
}