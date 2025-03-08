import cron from 'node-cron';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
);
console.log("secret : ", process.env.CLIENT_SECRET);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  
cron.schedule('0 0 * * *', async () => {
    console.log("cron-job running...");
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        console.log(accessToken);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_ADMIN,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const users = await User.find({
            'notificationSettings.dailyNotifications': true,
        });
        console.log(users);
        for (const user of users) {
            const mailOptions = {
                from: 'papa <process.env.EMAIL_ADMIN>',
                to: user.email,
                subject: 'Alert from papa!',
                text: `Hello ${user.fullName}, this is papa from BOOKS. Try visiting my website...`,
                html: `
                    <h1>Hello Motherlover!<h1>
                    <p>This is papa from BOOKS<p>
                    <p>Try visiting my website sometime...<p>
                `,
            };
            console.log("sending mail...");
            await transporter.sendMail(mailOptions);
            console.log(`Notification sent to ${user.email}`);
        }
    } catch (error) {
        console.error('Error sending daily notifications:', error);
    }
});
