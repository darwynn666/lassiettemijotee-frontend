import Link from "next/link";
import styles from "@/styles/dashboard/Signin.module.css";
import SiteHead from "../components/SiteHead";
import { useState, useEffect } from "react";
import { fetchLoginAdmin } from "@/features/auth/authAPI";
import { setAuth, logout } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function Signin() {
    const router = useRouter()
    // console.log(router.query)
    const dispatch = useDispatch()

    const auth = useSelector((state) => state.auth.value)
    // console.log('auth', auth)

    useEffect(() => {
        if (router.query.logout) {
            dispatch(logout())
        }
        // if (auth) router.push({ pathname: '/dashboard/Settings' }); return
    }, [router])

    // useEffect(()=>{
    //     console.log('auth',auth)
    // },[auth])



    const { forbidden, redirection } = router.query
    const redirToPage = redirection || "Members"

    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSubmit = async () => {
        setErrorMessage(null)
        // check form
        if (!password) { setErrorMessage('Mot de passe requis'); return }

        // fetch
        try{
            const response = await fetchLoginAdmin(password)
            // console.log('response', response)
            if (response.error) { setErrorMessage(response.error) }
            else {
                console.log('connected, redir to', redirToPage, response)
                router.push({ pathname: redirToPage })
            }
            dispatch(setAuth(response.auth))
        }
        catch(err) {
            console.log(err)
        }

    }

    return (
        <>
            <SiteHead>Espace restaurateur</SiteHead>
            <main className={styles.main}>


                <div className={styles.titleContainer}>
                    <span>{forbidden ? "Page réservée au restaurateur" : "Connexion à l'espace restaurateur"}</span>
                </div>

                <div className={styles.infosContainer}>
                    <span>Saisissez le mot de passe restaurateur pour accéder aux fonctionnalités avancées.</span>
                </div>

                <div className={styles.formContainer}>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='input' placeholder='password' />
                    <div className={styles.errorMessage}>{errorMessage}</div>
                </div>

                <div className={styles.buttonsContainer}>
                    <button onClick={() => handleSubmit()} className='button bg-green'>Connexion</button>
                    <Link href='/' className='button bg-lightgray'>Retour</Link>
                </div>

            </main>
        </>
    )
}
