import bcrypt from 'bcrypt';
import { authenticationHashUrl } from '../Core/CONFIG/CONFIG';

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

/**
 * Hash a string.
 */
export const Hash = (input: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        let url: URL = new URL(`${window.location.origin}${authenticationHashUrl}`);
        let init: RequestInit = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: input
            })
        };
        fetch(url, init)
            .then(res => res.json())
            .then((res: any) => {
                // console.log(`login response: ${JSON.stringify(res)}`);
                if (res.success) {

                    resolve(res.value);
                } else {
                    reject(res.error);
                }
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}