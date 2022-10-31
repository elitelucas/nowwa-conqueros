export type ComponentState = {
    initialized: boolean,
    busy: boolean,
}

export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export const ComponentStateDefault: ComponentState = {
    busy: false,
    initialized: false
}

export const UpdateComponentState = <T extends { [key: string]: unknown }>(state: T, values: Partial<T>): T => {
    let newState = JSON.parse(JSON.stringify(state)) as T;
    let keys: string[] = Object.keys(values);
    for (let i: number = 0; i < keys.length; i++) {
        let key: string = keys[i];
        (newState as { [key: string]: unknown })[key] = values[key];
    }
    return newState;
};