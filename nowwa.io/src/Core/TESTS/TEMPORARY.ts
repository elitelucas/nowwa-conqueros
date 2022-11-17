class TEMPORARY {
    static instance: TEMPORARY;
    static get Instance(): TEMPORARY {
        if (!this.instance) {
            this.instance = new TEMPORARY();
        }
        return this.instance;
    }

    private initialized: boolean;
    private data: { [key: string]: any[] };

    constructor() {
        this.initialized = false;
        this.data = {};
    }

    public static async Init(): Promise<void> {
        return TEMPORARY.Instance.init();
    }

    private async init(): Promise<void> {
        this.initialized = true;
        return Promise.resolve();
    }

    public static async Get<T>(collection: string, query?: Partial<T>): Promise<Partial<T>[]> {
        return TEMPORARY.Instance.get(collection, query);
    }

    private async get<T>(collection: string, query?: Partial<T>): Promise<Partial<T>[]> {

        let i = TEMPORARY.Instance;

        if (!i.initialized) return Promise.reject(new TEMPORARY.ERROR(TEMPORARY.ERROR_TYPE.NOT_INITIALIZED));

        if (!i.data[collection]) return Promise.reject(new TEMPORARY.ERROR(TEMPORARY.ERROR_TYPE.COLLECTION_DOES_NOT_EXISTS));

        if (!query) {
            return Promise.resolve(i.data[collection]);
        }

        let output: Partial<T>[] = [];
        let keys: (keyof T)[] = Object.keys(query) as any;
        let collections: Partial<T>[] = i.data[collection];
        for (let x = 0; x < collections.length; x++) {
            let tmp: Partial<T> = collections[x];
            console.log(`tmp: ${JSON.stringify(tmp)}`);
            let match: boolean = true;
            for (let y: number = 0; y < keys.length; y++) {
                let key = keys[y];
                if (tmp[key] != query[key]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                output.push(tmp);
            }
        }

        return Promise.resolve(output);
    }

    public static async Set<T>(collection: string, values: Partial<T>, uniques: (keyof Partial<T>)[]): Promise<Partial<T>> {
        return TEMPORARY.Instance.set<T>(collection, values, uniques);
    }

    private async set<T>(collection: string, values: Partial<T>, uniques: (keyof Partial<T>)[]): Promise<Partial<T>> {

        let i = TEMPORARY.Instance;

        if (!i.initialized) return Promise.reject(new TEMPORARY.ERROR(TEMPORARY.ERROR_TYPE.NOT_INITIALIZED));

        if (!i.data[collection]) {
            i.data[collection] = [];
        }

        let uniqueValues: Partial<T> = {};
        uniques.forEach(element => {
            uniqueValues[element] = values[element];
        });
        let entries = await i.get<T>(collection, uniqueValues);
        if (entries.length > 0) return Promise.reject(new TEMPORARY.ERROR(TEMPORARY.ERROR_TYPE.ALREADY_HAS_EXISTING_ENTRY));

        i.data[collection].push(values);
        return Promise.resolve(values);
    }
}

namespace TEMPORARY {
    export enum ERROR_TYPE {
        NOT_INITIALIZED = 0,
        COLLECTION_DOES_NOT_EXISTS = 1,
        ALREADY_HAS_EXISTING_ENTRY = 2
    }
    export class ERROR extends Error {

        constructor(errorType: ERROR_TYPE) {
            let message: string = '';
            if (errorType == ERROR_TYPE.NOT_INITIALIZED) {
                message = '[TEMPORARY] is not initialized...'
            } else if (errorType == ERROR_TYPE.COLLECTION_DOES_NOT_EXISTS) {
                message = '[TEMPORARY] does not have collection of given value...'
            } else if (errorType == ERROR_TYPE.ALREADY_HAS_EXISTING_ENTRY) {
                message = '[TEMPORARY] already has an existing entry with given unique values...'
            }
            super(message);
        }
    }
}

export default TEMPORARY;