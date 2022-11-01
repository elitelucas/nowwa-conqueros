import express from 'express';
import Environment from '../CONFIG/Environment';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

class Email {

    private static Instance: Email;

    /**
     * Initialize email module.
     */
    public static async AsyncInit(app: express.Express, env: Environment.Config): Promise<void> {
        Email.Instance = new Email(env);
        return Promise.resolve();
    }

    private transporter: Transporter;
    private emailSender: string;

    constructor(env: Environment.Config) {
        this.emailSender = `${env.VERIFY_EMAIL_SENDER}`;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${env.VERIFY_EMAIL_SENDER}`,
                pass: `${env.VERIFY_EMAIL_PASSWORD}`
            }
        });
    }

    public static async Send(receiver: string, subject: string, content: string) {
        let mailOptions: MailOptions = {
            from: Email.Instance.emailSender,
            to: receiver,
            subject: subject,
            html: content
        };
        Email.Instance.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return Promise.reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                return Promise.resolve(info);
            }
        });
    }
}

namespace Email {

}

export default Email;