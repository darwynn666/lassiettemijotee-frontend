import styles from '@/styles/dashboard/Dashboard.module.css'
import Header from './components/Header'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL, MENU_IMAGE_URL } from '@/features/utils/utils'
import { fetchGetSettings, fetchSetSettings, fetchSetImage } from '@/features/settings/settingsAPI'
import useAuthRedirect from '@/features/auth/useAuthRedirect'

export default function Settings() {
    useAuthRedirect()
    const router = useRouter()
    const auth = useSelector((state) => state.auth.value)
    // console.log('auth', auth)

    const [priceClient, setPriceClient] = useState(0)
    const [priceVolunteer, setPriceVolunteer] = useState(0)
    const [priceEmployee, setPriceEmployee] = useState(0)
    const [priceExternal, setPriceExternal] = useState(0)
    const [newPassword, setNewPassword] = useState()
    const [newPassword2, setNewPassword2] = useState()
    const [errorMessage, setErrorMessage] = useState(null)
    const [menuImageUrl, setMenuImageUrl] = useState(MENU_IMAGE_URL)

    const inputFile = useRef(null)

    useEffect(() => {
        const getSettings = async () => {
            const settings = await fetchGetSettings(auth.token)
            if (settings) {
                // console.log(settings)
                setPriceClient(settings.memberships_prices[0].price)
                setPriceVolunteer(settings.memberships_prices[1].price)
                setPriceEmployee(settings.memberships_prices[2].price)
                setPriceExternal(settings.memberships_prices[3].price)
            }
        }
        getSettings()
    }, [auth, router])




    const handleSubmit = async () => {
        setErrorMessage(null)
        // check form
        if (isNaN(priceClient) || isNaN(priceVolunteer) || isNaN(priceEmployee) || isNaN(priceExternal)) return setErrorMessage('Un des montant est invalide')
        const passwordRegex = /^[A-Za-z0-9]{6,}$/
        if (newPassword !== newPassword2)
            return setErrorMessage('Les mots de passe ne sont pas identiques')
        if (newPassword && !passwordRegex.test(newPassword))
            return setErrorMessage('Le mot de passe doit faire au moins 6 caractères (chiffres ou lettres) sans espaces')

        // fetch
        const response = await fetchSetSettings({ token: auth.token, priceClient, priceVolunteer, priceEmployee, priceExternal, newPassword, newPassword2 })
        if (response) {
            console.log('settings enregistrés !')
            router.push({ pathname: '/dashboard/Members' })
        }
        else { router.push({ pathname: '/dashboard/Signin', query: { forbidden: true, redirection: 'Settings' } }) }
    }

    const handleLogout = () => {
        router.push({ pathname: '/dashboard/Signin', query: { logout: true } })
    }

    const handleMenuClick = () => {
        console.log('click menu')
        inputFile.current.click()
    }

    const handleImageChange = async (e) => {
        const imageFile = e.target.files[0]
        console.log('file ready', imageFile)


        const formData = new FormData()
        formData.append('image', imageFile)
        console.log('formData', formData)

        const response = await fetchSetImage(formData)
        if (response) setMenuImageUrl(`${MENU_IMAGE_URL}?${new Date().getTime()}`)
    }

    return (
        <>
            <div className={styles.main}>

                <div className={styles.titleContainer}>
                    <span>Paramètres</span>
                </div>

                <div className={styles.weekMenuContainer}>
                    <div className={styles.weekMenuLeft}>
                        <span className='text-m fg-green'>Menu de la semaine</span>
                        <span className='fg-lightgray'>Cliquez sur le menu pour le changer</span>
                    </div>
                    <div className={styles.weekMenuRight}>
                        <img onClick={() => handleMenuClick()} src={menuImageUrl} alt='menu' className={`${styles.weekMenuImg} pointer`}></img>
                        <input onChange={(e) => handleImageChange(e)} type='file' className='hidden' ref={inputFile} accept='image/jpeg' />
                    </div>
                </div>

                <hr></hr>

                <div>
                    <span className='fg-green'>Montant de l'adhésion en euros</span>
                </div>

                <div className={styles.amountsContainer}>
                    <div className={styles.amountContainer}>
                        <span className='fg-lightgray'>client</span>
                        <input onChange={(e) => setPriceClient(e.target.value)} value={priceClient} placeholder='?' className='input' />
                    </div>
                    <div className={styles.amountContainer}>
                        <span className='fg-lightgray'>bénévole</span>
                        <input onChange={(e) => setPriceVolunteer(e.target.value)} value={priceVolunteer} placeholder='?' className='input' />
                    </div>
                    <div className={styles.amountContainer}>
                        <span className='fg-lightgray'>salarié</span>
                        <input onChange={(e) => setPriceEmployee(e.target.value)} value={priceEmployee} placeholder='?' className='input' />
                    </div>
                    <div className={styles.amountContainer}>
                        <span className='fg-lightgray'>externe</span>
                        <input onChange={(e) => setPriceExternal(e.target.value)} value={priceExternal} placeholder='?' className='input' />
                    </div>
                </div>

                <hr></hr>

                <div>
                    <span className='fg-green'>Changer le mot de passe</span>
                </div>
                <div className={styles.formContainer}>
                    <input type='password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder='nouveau mot de passe' autoComplete='off' className='input' />
                    <input type='password' onChange={(e) => setNewPassword2(e.target.value)} value={newPassword2} placeholder='confirmez le mot de passe' autoComplete='off' className='input' />
                </div>

                <span className={styles.errorMessage}>{errorMessage}</span>

                <div className={styles.buttonsContainer}>
                    <button onClick={() => handleSubmit()} className='button bg-green'>Enregistrer</button>
                    <button onClick={() => handleLogout()} className='button bg-red'>Deconnexion</button>
                    <Link href='/dashboard/Members' className='button bg-lightgray'>Retour</Link>
                </div>

            </div >
        </>
    )
}