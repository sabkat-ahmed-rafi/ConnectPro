import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext()

const Authentication = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const register = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(email, password);
    }

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const contextInfo = {register, login, user, loading}

    return (
        <>
            <AuthContext.Provider value={contextInfo}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default Authentication;