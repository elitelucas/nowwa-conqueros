import express from 'express';
import CONFIG from '../CONFIG/CONFIG';
import nodemailer, { Transport, Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

class Email {

    private static Instance: Email;

    /**
     * Initialize email module.
     */
    public static async AsyncInit(): Promise<void> {
        Email.Instance = new Email();
        return Promise.resolve();
    }

    private transporter: Transporter;
    private emailSender: string;

    constructor() 
    {
        this.emailSender = `${CONFIG.vars.VERIFY_EMAIL_SENDER}`;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${CONFIG.vars.VERIFY_EMAIL_SENDER}`,
                pass: `${CONFIG.vars.VERIFY_EMAIL_PASSWORD}`
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