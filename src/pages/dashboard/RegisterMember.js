import styles from '@/styles/dashboard/Dashboard.module.css'
import Header from './components/Header'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL, isValidEmail, isValidPhone } from '@/features/utils/utils'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import useAuthRedirect from '@/features/auth/useAuthRedirect'
import { fetchPrices } from '@/features/settings/settingsAPI'
import { fetchConfirmNewMembership, fetchCancelNewMembership } from '@/features/users/usersAPI'


export default function RegisterMember() {
    useAuthRedirect()
    const router = useRouter()
    const auth = useSelector((state) => state.auth.value)

    const { userIndex, membershipsIndex } = router.query
    if (!userIndex || !membershipsIndex) return

    const [firstname, setFirstname] = useState(router.query.firstname)
    const [lastname, setLastname] = useState(router.query.lastname)
    const [email, setEmail] = useState(router.query.email)
    const [phone, setPhone] = useState(router.query.phone)
    const [city, setCity] = useState(router.query.city)
    const [errorMessage, setErrorMessage] = useState()
    const [price, setPrice] = useState(0)

    const [type, setType] = useState(router.query.type)

    // get prices
    useEffect(() => {
        (async () => {
            const response = await fetchPrices()
            // console.log(await response)
            const price = await response.find(e => e.type === type).price
            // console.log(price)
            setPrice(price)
        })()
    }, [type])


    // console.log(router.query)


    const handleSubmit = async () => {
        setErrorMessage(null)

        // check form
        if (!firstname || !lastname || !email || !phone || !city) { setErrorMessage('Tous les champs sont obligatoires'); return }
        if (!isValidEmail(email)) { setErrorMessage('Email invalide'); return }
        const formattedEmail = email.toLowerCase()
        if (!isValidPhone(phone)) { setErrorMessage('Numéro invalide'); return }
        const formattedPhone = phone[0] === '0' ? phone.replace(/^0/, '+33') : phone

        const response = await fetchConfirmNewMembership(auth.token, firstname, lastname, formattedEmail, formattedPhone, city, price, type, userIndex, membershipsIndex)
        // console.log(response)
        if (response) router.push({ pathname: 'Members' })
    }

    const handleCanceNewMembership = async () => {
        if (window.confirm(`Supprimer la demande de ${firstname} ${lastname} ?`)) {
            const response = await fetchCancelNewMembership(auth.token, userIndex, membershipsIndex)
            // console.log(response)
            if (response) router.push({ pathname: 'Members' })
        }
    }


    return (
        <>
            <div className={styles.main}>

                <div className={styles.titleContainer}>
                    <span>Nouvelle adhésion</span>
                </div>

                <div className={styles.infosContainer}>
                    <span>Vérifiez les informations avec l'adhérent, puis validez une fois la cotisation réglée</span>
                </div>

                <div className={styles.formContainer}>
                    <input onChange={(e) => setFirstname(e.target.value)} value={firstname} placeholder='prénom' className='input'></input>
                    <input onChange={(e) => setLastname(e.target.value)} value={lastname} placeholder='nom' className='input'></input>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email' className='input'></input>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder='tél. portable' className='input'></input>
                    <input onChange={(e) => setCity(e.target.value)} value={city} placeholder='ville' className='input'></input>
                    <div className={styles.errorMessage}>{errorMessage}</div>
                </div>

                {/* <div className={styles.infosContainer}>
                    <span className='text-xl'>Type d'adhésion</span>
                </div> */}

                <div className={styles.typesContainer}>
                    <div onClick={() => setType('client')} className={styles.typeContainer}>
                        <span>Client</span>
                        <FontAwesomeIcon icon={type === 'client' ? faToggleOn : faToggleOff} className='text-xxl pointer fg-green' />
                    </div>
                    <div onClick={() => setType('volunteer')} className={styles.typeContainer}>
                        <span>Bénévole</span>
                        <FontAwesomeIcon icon={type === 'volunteer' ? faToggleOn : faToggleOff} className='text-xxl pointer fg-green' />
                    </div>
                    <div onClick={() => setType('employee')} className={styles.typeContainer}>
                        <span>Employé</span>
                        <FontAwesomeIcon icon={type === 'employee' ? faToggleOn : faToggleOff} className='text-xxl pointer fg-green' />
                    </div>
                    <div onClick={() => setType('external')} className={styles.typeContainer}>
                        <span>Externe</span>
                        <FontAwesomeIcon icon={type === 'external' ? faToggleOn : faToggleOff} className='text-xxl pointer fg-green' />
                    </div>
                </div>

                <div className={styles.priceContainer}>
                    <span className='text-xxl'>à régler : {price}€</span>
                </div>

                <div className={styles.infosContainer}>
                    <span className=''>Validez aussi le réglement en caisse</span>
                </div>

                <div className={styles.buttonsContainer}>
                    <button onClick={() => handleSubmit()} className='button bg-green'>Valider</button>
                    <button onClick={() => handleCanceNewMembership()} className='button bg-red'>Annuler cette demande</button>
                    <Link href='/dashboard/Members' className='button bg-lightgray'>Retour</Link>
                </div>

            </div>

        </>
    )
}