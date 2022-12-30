import bcrypt from "bcrypt";

class CRYPT
{
    public static async hash(input: string): Promise<string> 
    {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) { reject(err); }
                bcrypt.hash(input, salt, (err, output) => {
                    if (err) { reject(err); }
                    resolve(output);
                });
            });
        });
    }
 
    public static async match( input: string, hash: string): Promise<boolean> 
    {
        return new Promise((resolve, reject) => 
        {
            bcrypt.compare(input, hash, (err, isMatch) => {
                if (err) { reject(err); }
                resolve(isMatch);
            });
        });
    }

    public static async verify(value: string, token: string): Promise<boolean> 
    {
        let secret: string = <string>process.env.EXPRESS_SECRET;
        let input: string = `${value}|${secret}`;

        return this.match(input, token);
    }

    public static async hashedToken(value: string): Promise<string> 
    {
        let input: string = await this.token(value);

        return this.hash(input);
    }

    public static async token(value:string) :Promise<string> {
        let secret: string = <string>process.env.EXPRESS_SECRET;
        let output: string = `${value}|${secret}`;
        return Promise.resolve(output);
    }

    
};

export default CRYPT;