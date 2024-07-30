import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from './Firebase/firebase.init';
import axios from 'axios';
import socketIOClient from 'socket.io-client'


export const AuthContext = createContext()

const Authentication = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();
    const [socket, setSocket] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState()




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
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, { withCredentials: true })
        socket && socket.disconnect();
        setSocket(null)
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
                setUser(currentUser)
                saveTokenToCookie(currentUser.email)
                console.log(currentUser.email)

                const socketInstance = socketIOClient(import.meta.env.VITE_BACKEND_URL)

                socketInstance.on('connect', () => {
                    console.log(`socket connected : ${socketInstance.id}`)
                    // i can save other information of user in the database 
                    socketInstance.emit('register', { 
                        uid: currentUser.uid, 
                        email: currentUser.email,
                        userName: currentUser.displayName,
                        photo: currentUser.photoURL ? currentUser.photoURL : 'noPhoto.jpg'
                     })
                })

                setSocket(socketInstance);
                
            } else {
                if(socket) {
                    socket.disconnect();
                    setSocket(null)
                }
                setLoading(false)
            }
        })

        return () => {
            
            unsubscribe()
            if(socket) socket.disconnect();
        }
    }, [])

    const contextInfo = {createUser, login, updateUser, googleLogin, logout, user, loading, setLoading, socket, recipientEmail, setRecipientEmail}

    return (
        <>
            <AuthContext.Provider value={contextInfo}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export default Authentication;