import { ref, set, update } from "@firebase/database";
import { db } from "../firebaseConfig";


export const writeValue = (path: string, value: any) => set(ref(db, path), value)

export const updateValue = (path: string, value: object) => update(ref(db, path), value)