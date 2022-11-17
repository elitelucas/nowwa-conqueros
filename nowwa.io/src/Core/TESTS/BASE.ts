interface BASE<T> {
    readonly name: string;
    init(): void;
    get(query?: Partial<T>): Promise<Partial<T>[]>;
    set(values: Partial<T>): Promise<Partial<T>>;
    change(query: Partial<T>, values: Partial<T>): Promise<Partial<T>>;
    remove(query: Partial<T>): Promise<Partial<T>>;
}

export default BASE;