import { auth } from "../firebaseConfig";

export const getUid = () => { 
    return auth.currentUser?.uid
};