import BASE from "./BASE";
import TEMPORARY from "./TEMPORARY";

type ACCOUNT_TYPE = {
    username: string;
    password: string;
    verified: boolean;
}

const ACCOUNT_TYPE_DEFAULT: Partial<ACCOUNT_TYPE> = {
    username: '',
    password: '',
    verified: false
}

class ACCOUNT {
    readonly name: string = 'ACCOUNT';
    static instance: ACCOUNT;
    private static get Instance(): ACCOUNT {
        if (!this.instance) {
            this.instance = new ACCOUNT();
        }
        return this.instance;
    }
    constructor() {

    }
    public init(): void {

    }
    public static Get(query?: Partial<ACCOUNT_TYPE> | undefined): Promise<Partial<ACCOUNT_TYPE>[]> {
        return ACCOUNT.Instance.get(query);
    }

    private get(query?: Partial<ACCOUNT_TYPE> | undefined): Promise<Partial<ACCOUNT_TYPE>[]> {
        return Promise.resolve(TEMPORARY.Get<ACCOUNT_TYPE>(ACCOUNT.Instance.name, query));
    }

    public static Set(values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return ACCOUNT.Instance.set(values);
    }

    private set(values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return Promise.resolve(TEMPORARY.Set<ACCOUNT_TYPE>(ACCOUNT.Instance.name, values));
    }

    public change(query: Partial<ACCOUNT_TYPE>, values: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return Promise.resolve(ACCOUNT_TYPE_DEFAULT);
    }

    public remove(query: Partial<ACCOUNT_TYPE>): Promise<Partial<ACCOUNT_TYPE>> {
        return Promise.resolve(ACCOUNT_TYPE_DEFAULT);
    }
}

export default ACCOUNT;