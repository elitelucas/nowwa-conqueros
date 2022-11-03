import STRING from '../../UTIL/STRING';

class EMAIL
{
    public static set( email:string, uID:any )
    {
        if( !STRING.validateEmail( email ) ) return;

        

    }
    
 /*
         try {
            let token = await this.Hash(args.email);
            await Email.Send(args.email, `[Nowwa.io] Verify your Email`, `<html><body>Click <a href=${Environment.PublicUrl}${authenticationVerifyUrl}?email=${args.email}&token=${token}>here</a> to verify your email!</body></html>`);
        } 
        catch (error) 
        {
            console.log(`error: ${JSON.stringify(error)}`);
        }
        */
};

export default EMAIL;