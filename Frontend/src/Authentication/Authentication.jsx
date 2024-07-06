import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from './Firebase/firebase.init';


export const AuthContext = createContext()

const Authentication = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

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

    // Logging with Google 
    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    // Updating a user specific injfo 
    const updateUser = (name, photo='') => {
        setLoading(true);
        return updateProfile(auth.currentUser, {displayName: name, photoURL: photo});
    }

    // Log out a signed in user 
    const logout = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log(currentUser)
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const contextInfo = {createUser, login, updateUser, googleLogin, logout, user, loading, setLoading}

    return (
        <>
            <AuthContext.Provider value={contextInfo}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default Authentication;