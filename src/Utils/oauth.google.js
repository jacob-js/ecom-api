import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.R_URL);

export function getGoogleUser(token) {
    return new Promise((resolve, reject) => {
        client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        })
            .then(ticket => {
                const payload = ticket.getPayload();
                const userid = payload['sub'];
                const aud = payload['aud'];
                if(aud !== process.env.CLIENT_ID) {
                    reject('Invalid audience');
                }
                resolve({ fullname: payload.name, email: payload.email, pic: payload.picture });
            })
            .catch(err => {
                reject(err);
            });
    }).then(user => {
        return user;
    }).catch(err => {
        return err;
    });
}