import styles from '@/styles/dashboard/Dashboard.module.css'
import Header from './components/Header'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL, isValidEmail, isValidPhone } from '@/features/utils/utils'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff, faRepeat } from "@fortawesome/free-solid-svg-icons";
import useAuthRedirect from '@/features/auth/useAuthRedirect'
import { getDateRange, toShortString } from '@/features/utils/utils'
import { fetchGetUserById, fetchSetUser, fetchDeleteUser } from '@/features/users/usersAPI'
import { fetchPrices } from '@/features/settings/settingsAPI'
import { trackSynchronousPlatformIOAccessInDev } from 'next/dist/server/app-render/dynamic-rendering'


export default function EditMember() {
    useAuthRedirect()
    const router = useRouter()
    const auth = useSelector((state) => state.auth.value)

    const [userIndex, setUserIndex] = useState(router.query.userIndex)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [memberships, setMemberships] = useState([])
    const [membershipsCards, setMembershipsCards] = useState([])
    const [nbYears, setNbYears] = useState(0)
    const [prices, setPrices] = useState([])
    const [errorMessage, setErrorMessage] = useState()


    // console.log(router.query)

    useEffect(() => {
        // get user
        const getUser = async () => {
            const user = await fetchGetUserById(auth.token, userIndex)
            // console.log(user)
            if (user.id) {
                setFirstname(user.firstname)
                setLastname(user.lastname)
                setEmail(user.email)
                setPhone(user.phone)
                setCity(user.city)
                user.memberships = user.memberships.sort((a, b) => new Date(b.date) - new Date(a.date))
                setMemberships(user.memberships)
                setNbYears(user.memberships.length)
            }
        }
        getUser()
        // get prices
        const getPrices = async () => {
            const p = await fetchPrices()
            setPrices(p)
        }
        getPrices()
    }, [])

    // select type (client, volunteer, employee, external)
    const handleToggleType = (membershipIndex) => {
        // console.log(memberships[membershipIndex].type, prices)
        const typeIndex = prices.findIndex(p => p.type === memberships[membershipIndex].type) // search id ot memberships type in prices array
        const newTypeIndex = typeIndex === prices.length - 1 ? 0 : typeIndex + 1 // increase id, set to 0 if last

        // console.log(typeIndex, newTypeIndex)
        const newType = prices[newTypeIndex].type

        const membershipsCopy = memberships.map((m, i) => { // creates an independant copy of memberships
            if (i === membershipIndex) {
                return { ...m, type: newType, amount: 0 }
            }
            else { return { ...m } }
        })
        setMemberships(membershipsCopy)
        // console.log(memberships)
    }

    // toggle amount : 0 <-> price from type
    const handleTogglePaid = (membershipIndex) => {
        const membershipsCopy = memberships.map((m, i) => { // creates an independant copy of memberships
            if (i === membershipIndex) { // modify one item by his index
                if (m.amount > 0) { return { ...m, amount: 0 } }
                else {
                    const id = prices.findIndex(e => e.type === m.type)
                    // console.log('priceid', id)
                    return { ...m, amount: prices[id].price }
                }
            }
            else { return { ...m } }
        })
        // console.log('membershipsCopy', membershipsCopy)
        setMemberships(membershipsCopy)
    }

    // submit user (details + memberships)
    const handleSubmit = async () => {
        setErrorMessage(null)

        // check form
        if (!firstname || !lastname || !email || !phone || !city) { setErrorMessage('Tous les champs sont obligatoires'); return }
        if (!isValidEmail(email)) { setErrorMessage('Email invalide'); return }
        const formattedEmail = email.toLowerCase()
        if (!isValidPhone(phone)) { setErrorMessage('Numéro invalide'); return }
        const formattedPhone = phone[0] === '0' ? phone.replace(/^0/, '+33') : phone

        const response = await fetchSetUser(auth.token, firstname, lastname, formattedEmail, formattedPhone, city, memberships, userIndex)
        // console.log(response)
        if (response) router.push({ pathname: 'Members' })
    }

    const handleDeleteMember = async () => {
        if (window.confirm(`Supprimer la fiche de ${firstname} ${lastname} supprimera également l'historique de toutes ses adhésions. Cette action est irréversible. Etes-vous sûr ?`)) {
            const response = await fetchDeleteUser(auth.token, userIndex)
            // console.log(response)
            if (response) router.push({ pathname: 'Members' })
        }
    }

    useEffect(() => {
        setMembershipsCards(memberships.map((m, i) => {
            // console.log(i, m)
            const dateArray = m.date.split('T')[0].split('-') // ISO to [YYYY, MM, DD]
            const dateString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` // String DD-MM-YYYY
            let type
            m.type === 'client' ? type = 'Client' : m.type === 'volunteer' ? type = 'Bénévole' : m.type === 'employee' ? type = 'Employé' : m.type === 'external' ? type = 'Externe' : type = '-'

            return (
                <div key={i} className={styles.membershipContainer}>
                    <span className={styles.columnLeft}>{dateString}</span>
                    <span className={styles.columnLeft}>
                        <span onClick={() => handleToggleType(i)} className='fg-green pointer'>{type}</span>
                        <span>&nbsp;</span>
                        <FontAwesomeIcon icon={faRepeat} className='text-m fg-lightgray' />
                    </span>
                    <span className={styles.columnRight}>
                        <FontAwesomeIcon onClick={() => handleTogglePaid(i)} icon={m.amount > 0 ? faToggleOn : faToggleOff} className='text-xxl pointer fg-green' />
                    </span>
                </div>
            )
        }))
    }, [memberships])

    // console.log('memberships', memberships)

    return (
        <>
            <div className={styles.main}>

                <div className={styles.titleContainer}>
                    <span>Fiche membre</span>
                </div>

                <div className={styles.formContainer}>
                    <input onChange={(e) => setFirstname(e.target.value)} value={firstname} placeholder='prénom' className='input'></input>
                    <input onChange={(e) => setLastname(e.target.value)} value={lastname} placeholder='nom' className='input'></input>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email' className='input'></input>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder='tél. portable' className='input'></input>
                    <input onChange={(e) => setCity(e.target.value)} value={city} placeholder='ville' className='input'></input>
                    <div className={styles.errorMessage}>{errorMessage}</div>
                </div>

                <div>
                    <span className='fg-lightgray'>Adhérent depuis {nbYears} ans</span>
                </div>

                <div className={styles.membershipsHeaders}>
                    <span className={styles.columnLeft}>Adhésions</span>
                    <span className={styles.columnLeft}>Type</span>
                    <span className={styles.columnRight}>Réglé</span>
                </div>

                <div className={styles.membershipsContainer}>
                    {membershipsCards}
                </div>

                <div className={styles.buttonsContainer}>
                    <button onClick={() => handleSubmit()} className='button bg-green'>Enregistrer</button>
                    <button onClick={() => handleDeleteMember()} className='button bg-red'>Supprimer le membre</button>
                    <Link href='/dashboard/Members' className='button bg-lightgray'>Retour</Link>
                </div>

            </div>
        </>
    )
}