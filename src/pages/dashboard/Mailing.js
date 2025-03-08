import styles from '@/styles/dashboard/Dashboard.module.css'
import Header from './components/Header'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL } from '@/features/utils/utils'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCopy, faDownload, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import useAuthRedirect from '@/features/auth/useAuthRedirect'
import { fetchGetAllUsers, fetchGetDatabase } from '@/features/users/usersAPI'


export default function Mailing() {
    useAuthRedirect()
    const router = useRouter()
    const auth = useSelector((state) => state.auth.value)

    const [users, setUsers] = useState()
    const [selectedTypes, setSelectedTypes] = useState([])

    const getUsers = async () => {
        const result = await fetchGetAllUsers(auth.token)
        if (result) setUsers(result)
    }

    // const getDatabase = async () => {
    //     const result = await fetchGetDatabase(auth.token)
    //     if (result) console.log('getDatabase() success', result)
    //     else console.log('getDatabase() error', result)
    // }

    useEffect(() => {
        getUsers()
    }, [])


    // global functions
    const copyToClipboard = (text) => {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    const createAndDownloadCSV = (filename, content) => {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // action functions
    const handleToggleType = (type) => {
        // console.log(type, selectedTypes)
        const t = [...selectedTypes]
        t.includes(type) ? t.splice(t.indexOf(type), 1) : t.push(type)
        setSelectedTypes(t)
    }

    // onClick button functions
    const selectEmails = (action) => {
        // console.log('open mail client')
        // console.log(selectedTypes, users)
        const emailList = users
            .filter(user => user.memberships.some(m => selectedTypes.includes(m.type)))
            .map(user => user.email)
            .join(',')
        console.log(emailList)

        if (action === 'send') { // open mail client
            // console.log('send')
            window.location.replace(`mailto:?bcc=${emailList}`)
        }
        if (action === 'copy') { // copy to clipboard
            // console.log('copy')
            copyToClipboard(emailList)
            alert('Mails copiés, rendez-vous dans votre application de messagerie et collez-les dans le champ "Cci:" (copie conforme invisible). \n\nNe les copiez pas dans le champ "To:" sinon chaque destinataire aura accès à la liste de mails.')
        }
    }


    const downloadUsers = () => {
        // console.log('download users')
        const csvRows = []
        csvRows.push(['id', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Ville', 'Adhésions réglées', 'Adhésions non réglées'].join(';'))
        users.forEach(u => {
            const nbPaidAmounts = u.memberships.filter(m => m.amount > 0).length
            const nbUnpaidAmounts = u.memberships.filter(m => m.amount === 0).length
            const row = [u.id, u.firstname, u.lastname, u.email, u.phone, u.city, nbPaidAmounts, nbUnpaidAmounts]
            csvRows.push(row.join(';'))
        })
        const csvString = csvRows.join('\r\n')
        copyToClipboard(csvString)
        createAndDownloadCSV('membres.csv', csvString)
    }

    const downloadMemberships = () => {
        console.log('download memberships')
        const csvRows = []
        csvRows.push(['Date', 'Prénom', 'Nom', 'Type', 'Montant'].join(';'))
        users.forEach(u => {
            u.memberships.forEach(m => {
                if (m.amount === 0) return // list only paid memberships
                const localDate = new Date(m.date).toLocaleString()
                let type = 'iconnu'
                m.type === 'client' && (type = 'client')
                m.type === 'volunteer' && (type = 'bénévole')
                m.type === 'employee' && (type = 'employé')
                m.type === 'external' && (type = 'externe')
                const row = [localDate, u.firstname, u.lastname, type, m.amount]
                csvRows.push(row.join(';'))
            })
        })
        const csvString = csvRows.join('\n')
        copyToClipboard(csvString)
        createAndDownloadCSV('adhesions.csv', csvString)
    }

    const downloadDatabase = async () => {
        console.log('download database')

        try {
            const url = `${API_URL}/settings/getdbfile`
            console.log('GET', url)
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${auth.token}>` },
            })
            if (!response.ok) throw new Error("Erreur lors du téléchargement");
            // Créer un Blob et déclencher le téléchargement
            const blob = await response.blob();
            const aUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = aUrl;
            a.download = "lassiettemijotee.sqlite"; // Nom du fichier
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(aUrl);
        }
        catch (err) {
            console.log('downloadDatabase() error', err)
        }

    }

    // console.log('users', users)

    return (
        <>
            <div className={styles.main}>

                <div className={styles.titleContainer}>
                    <span>Exporter</span>
                </div>

                <div className={styles.infosContainer}>
                    <span className='text-m fg-green' style={{ margin: '10px 0' }}>
                        Nombre total d'adhérents : {users && users.filter(u => u.memberships.some(m => m.amount > 0)).length}
                    </span>
                </div>

                <div className={styles.groupContainer}>

                    <div className={styles.labelContainer}>
                        <span>Choisissez les types d'adhérents</span>
                    </div>

                    <div className={styles.typesContainer}>
                        <div>
                            <span>Clients</span>
                            <FontAwesomeIcon onClick={() => { handleToggleType('client') }} icon={selectedTypes.includes('client') ? faToggleOn : faToggleOff} className='text-xxl pointer' />
                        </div>
                        <div>
                            <span>Bénévoles</span>
                            <FontAwesomeIcon onClick={() => { handleToggleType('volunteer') }} icon={selectedTypes.includes('volunteer') ? faToggleOn : faToggleOff} className='text-xxl pointer' />
                        </div>
                        <div>
                            <span>Employés</span>
                            <FontAwesomeIcon onClick={() => { handleToggleType('employee') }} icon={selectedTypes.includes('employee') ? faToggleOn : faToggleOff} className='text-xxl pointer' />
                        </div>
                        <div>
                            <span>Externes</span>
                            <FontAwesomeIcon onClick={() => { handleToggleType('external') }} icon={selectedTypes.includes('external') ? faToggleOn : faToggleOff} className='text-xxl pointer' />
                        </div>
                    </div>

                    <div className={styles.labelContainer}>
                        <span>Puis sélectionnez l'action</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <button onClick={() => selectEmails('send')} className='button bg-green' style={{ width: '45%' }}>
                            <FontAwesomeIcon icon={faEnvelope} className='text-xxl' />
                            <span>ENVOYER</span>
                        </button>
                        <button onClick={() => selectEmails('copy')} className='button bg-green' style={{ width: '45%' }}>
                            <FontAwesomeIcon icon={faCopy} className='text-xxl' />
                            <span>COPIER</span>
                        </button>
                    </div>

                    <div className={styles.labelContainer} style={{ fontSize: '0.8rem' }}>
                        <span>Si 'ENVOYER' ne fonctionne pas, essayez 'COPIER', puis collez le résultat dans le champ 'Cci:' d'un nouveau mail</span>
                    </div>

                </div>

                <div className={styles.groupContainer}>
                    <div>
                        <span className={styles.labelContainer}>
                            Télécharger la liste des membres au format Excel (CSV)
                        </span>
                    </div>
                    <div>

                        <button onClick={() => downloadUsers()} className='button bg-green w-full'>
                            <FontAwesomeIcon icon={faDownload} className='text-xxl pointer' />
                            <span>TELECHARGER MEMBRES</span>
                        </button>
                    </div>
                </div>

                <div className={styles.groupContainer}>
                    <div>
                        <span className={styles.labelContainer}>
                            Télécharge la liste des adhésions au format Excel (CSV)
                        </span>
                    </div>
                    <div>
                        <button onClick={() => downloadMemberships()} className='button bg-green w-full'>
                            <FontAwesomeIcon icon={faDownload} className='text-xxl pointer' />
                            <span>TELECHARGER ADHESIONS</span>
                        </button>
                    </div>
                </div>

                <div className={styles.groupContainer}>
                    <div>
                        <span className={styles.labelContainer}>
                            Sauvegarder la base de données (.sqlite)
                        </span>
                    </div>
                    <div>
                        <button onClick={() => downloadDatabase()} className='button bg-red w-full'>
                            <FontAwesomeIcon icon={faDownload} className='text-xxl pointer' />
                            <span>TELECHARGER BDD</span>
                        </button>
                    </div>
                </div>

                <div className={styles.buttonsContainer}>
                    <Link href='/dashboard/Members' className='button bg-lightgray'>Retour</Link>
                </div>

            </div>
        </>
    )
}