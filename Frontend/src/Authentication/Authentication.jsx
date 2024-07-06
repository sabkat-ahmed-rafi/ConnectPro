import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from './Firebase/firebase.init';

export const AuthContext = createContext()

const Authentication = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Creating a new user 
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Logging an existing user
    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Updating a user specific injfo 
    const updateUser = (name, photo='') => {
        setLoading(true);
        return updateProfile(auth.currentUser, {displayName: name, photoURL: photo});
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log(currentUser)
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const contextInfo = {createUser, login, updateUser, user, loading}

    return (
        <>
            <AuthContext.Provider value={contextInfo}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default Authentication;