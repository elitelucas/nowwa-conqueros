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

    
};

export default CRYPT;