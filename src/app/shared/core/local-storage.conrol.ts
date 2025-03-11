import { isObjectNotEmpty } from "./null-check";

export class LocalStorageControl {
    
    static parse<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item) as T;
        }
        return null;
    }

    static get(key: string):string {
        return localStorage.getItem(key);
    }

    static getParsed<T>(key: string):T {
        if(isObjectNotEmpty(localStorage.getItem(key)) && localStorage.getItem(key) != 'undefined') {
            return JSON.parse(localStorage.getItem(key)) as T
        }
        return null;
    }

    static set(key: string, value: string){
        localStorage.setItem(key, value);
    }

    static remove(key: string) {
        localStorage.removeItem(key);
    }

    static multipleRemove(keys: Array<string>) {
        for(const key of keys) {
            localStorage.removeItem(key);
        }
    }

    static clear() {
        localStorage.clear()
    }
}