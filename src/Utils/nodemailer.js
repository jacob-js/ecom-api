import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT == 465,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    }
});

export const sendCode = async(user, code) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bweteta Shopping Mall" ${SMTP_USER}`,
            to: user.email,
            subject: 'Code de confirmation',
            text: `Votre code de confirmation est ${code}`,
            html: `<p>Bonjour ${user.fullname || 'Mr, Mm, Mlle'},</p> <p>Votre code de confirmation est: <h1>${code}</h1> valide pendant 5 minutes</p>`
        });
        console.log('Message sent: %s', info);
    } catch (error) {
        console.log(error);        
    }
}