import { ACTIONS } from "../../Models/ENUM";
import CONQUER from "../CONQUER";

class Email 
{
    private conquer: CONQUER;

    public constructor(instance:CONQUER) 
    {
        this.conquer = instance;
    }

    public async init() : Promise<any> 
    {
        return Promise.resolve();
    }

    public async sendEmail (args: {
        email: string;
        subject: string;
        html?: string | undefined;
        content?: string | undefined;
    }) : Promise<any> 
    {
        let response : any = await this.conquer.do( ACTIONS.EMAIL_SEND, args );
        return Promise.resolve();
    }

}

export default Email;