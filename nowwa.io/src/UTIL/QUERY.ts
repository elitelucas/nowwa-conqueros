import mongoose from "mongoose";
import DATE from "./DATE";

class QUERY {
    public static get(vars: any) {
        return vars.where ? vars : { where: vars };
    };
    public static get2<T>(vars: Partial<T>): { where: Partial<T> } {
        return { where: vars };
    };


    public static set(vars: any) {
        let query: any = vars.values ? vars : { values: vars };
        if (query.values._id) delete (query.values._id);
        if (!query.values.timestamp) query.values.timestamp = DATE.now();

        return query;
    };


    public static set2<T>(vars: Partial<T>): { values: Partial<T> & { timestamp: number } } {
        return {
            values: {
                ...vars,
                timestamp: DATE.now()
            }
        };
    };

    public static change(vars: any) {
        let query: any = vars.values ? vars : { values: vars };
        if (query.values._id) delete (query.values._id);
        if (!query.values.lastChange) query.values.lastChange = DATE.now();

        return query;
    };


}

export default QUERY;