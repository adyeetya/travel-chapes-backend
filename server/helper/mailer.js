import nodemailer from "nodemailer";
import path from "path";
import fs from 'fs/promises';

const user = global.gConfig.nodemailer.USER;
const password = global.gConfig.nodemailer.PASS

var transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: password
    }
});

async function sendMail(data) {
    const { to, subject, html } = data;
    await transporter.sendMail({
        from: '',
        to: to,
        subject: subject,
        html: html
    });
}

async function getTemplateHtml(htmlPath) {
    try {
        const mailPath = path.resolve(htmlPath);
        const emailContent = await fs.readFile(mailPath, 'utf8');
        return emailContent;
    } catch (err) {
        throw new Error("Could not load html template");
    }
}
module.exports = {
    loginEmailOTP: async (to, subject, otp) => {
        const emailContent = await getTemplateHtml('emailTemplate/loginOtp.html');
        const html = emailContent.replace('{{OTP}}', otp);
        sendMail({ to, subject, html });
    },
    sendEmailUserQuery: async(to,subject,userEmail,name,query)=>{
        const emailContent = await getTemplateHtml('emailTemplate/userQuery.html');
        const html = emailContent.replace('{{name}}',name).replace("{{email}}",userEmail).replace("{{Date}}",new Date().toLocaleDateString()).replace('{{query}}',query);
        sendMail({to,subject,html});
    }
}