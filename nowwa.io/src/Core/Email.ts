import express from 'express';
import Environment from './Environment';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

class Email {

    private static Instance: Email;

    /**
     * Initialize email module.
     */
    public static async AsyncInit(app: express.Express, env: Environment.Config): Promise<void> {
        Email.Instance = new Email();
        return Promise.resolve();
    }

    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lanting.dlapan@gmail.com',
                pass: 'ydkcknektbfmjmtm'
            }
        });
    }

    public static async Send(receiver: string, subject: string, content: string) {
        let mailOptions: MailOptions = {
            from: 'lanting.dlapan@gmail.com',
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