import BASE from "./BASE";
import TEMPORARY from "./TEMPORARY";
import { RequiredKeys } from "./UTILITIES";

type ACCOUNT_TYPE = {
    username: string;
    password: string;
    verified?: boolean;
    admin?: boolean;
}

const ACCOUNT_TYPE_DEFAULT: Partial<ACCOUNT_TYPE> = {
    username: '',
    password: '',
    verified: false,
    admin: false
}

class ACCOUNT implements BASE<ACCOUNT_TYPE> {
    readonly name: string = 'ACCOUNT';
    static instance: ACCOUNT;
    private static get Instance(): ACCOUNT {
        if (!this.instance) {
            this.instance = new ACCOUNT();
        }
        return this.instance;
    }
    public init(): void {

    }
    public static Get(query?: Partial<ACCOUNT_TYPE> | undefined): Promise<Partial<ACCOUNT_TYPE>[]> {
        return ACCOUNT.Instance.get(query);
    }

    public get(query?: Partial<ACCOUNT_TYPE> | undefined): Promise<Partial<ACCOUNT_TYPE>[]> {
        return Promise.resolve(TEMPORARY.Get<ACCOUNT_TYPE>(ACCOUNT.Instance.name, query));
    }

    public static Set(values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return ACCOUNT.Instance.set(values);
    }

    public set(values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        type uniqueKeys = RequiredKeys<ACCOUNT_TYPE>;

        return Promise.resolve(TEMPORARY.Set<ACCOUNT_TYPE>(ACCOUNT.Instance.name, values, ['username']));
    }

    public static Change(query: Partial<ACCOUNT_TYPE>, values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return ACCOUNT.Instance.change(query, values);
    }

    public change(query: Partial<ACCOUNT_TYPE>, values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return Promise.resolve(ACCOUNT_TYPE_DEFAULT);
    }

    public remove(query: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return Promise.resolve(ACCOUNT_TYPE_DEFAULT);
    }
}

export default ACCOUNT;