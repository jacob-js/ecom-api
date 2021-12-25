import Vonage from '@vonage/server-sdk';

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
})

export const sendSms = (to, body) =>{
    vonage.message.sendSms('Bweteta', to, body, (err, response) => {
        if (err) {
            console.error(err)
        } else {
            if(response.messages[0].status === '0'){
                console.log(`Message sent to ${to}`);
            }else {
                console.log(`Message failed with error: ${response.messages[0]['error-text']}`);
            }
        }
    })
}