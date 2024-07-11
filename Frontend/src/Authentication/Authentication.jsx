import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from './Firebase/firebase.init';
import axios from 'axios';


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
    const logout = async () => {
        setLoading(true);
        console.log("logout rafi")
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, { withCredentials: true })
        return signOut(auth)
    }

    // Save token to the browser cookie section by requesting to the '/jwt' address 
    const saveTokenToCookie = async (email) => {
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/jwt`,
             { email },
             { withCredentials: true })
        return data
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log(currentUser)
            setUser(currentUser)
            if(currentUser) {
                saveTokenToCookie(currentUser.email)
                console.log(currentUser.email)
            }
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