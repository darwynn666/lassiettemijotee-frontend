import styles from '@/styles/dashboard/Header.module.css'
import { REFRESH_PENDINGS_INTERVAL } from '@/features/utils/utils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUtensils, faPaperPlane, faHourglass } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchGetPendingMembersList } from '@/features/users/usersAPI';

export default function Header() {
    const auth = useSelector((state) => state.auth.value)

    const [nbPendings, setNbPendings] = useState(0)
    const [refreshTrigger, setRefreshTrigger] = useState(true)

    // initialize refresh interval
    useEffect(() => {
        const i = setInterval(() => { setRefreshTrigger((trigger) => !trigger) }, REFRESH_PENDINGS_INTERVAL)
        return () => clearInterval(i)
    }, [])

    // refresh pendings every REFRESH_PENDINGS_INTERVAL ms
    useEffect(() => {
        // console.log('getPendings()', refreshTrigger)
        getPendings()
    }, [refreshTrigger])

    // get number of pendings
    const getPendings = async () => {
        try {
            const result = await fetchGetPendingMembersList(auth.token)
            // console.log('pendings', await result)
            setNbPendings(await result.pendings)
        }
        catch (err) {
            console.log('error while getting list', err)
            return false
        }
    }


    return (
        <div className={`${styles.main} ${nbPendings > 0 ? 'bg-green' : 'bg-green'}`}>
            <Link href='/'>
                <FontAwesomeIcon icon={faUtensils} className='text-xxl' style={{ color: 'white' }} />
            </Link>
            <Link href='PendingMembers' className={styles.pendingsContainer}>
                <FontAwesomeIcon icon={faHourglass} className='text-xxl' style={{ color: 'white' }} />
                {nbPendings > 0 &&
                    <span className={styles.pendingBadge}>{nbPendings}</span>
                }
            </Link>
            <Link href='Mailing'>
                <FontAwesomeIcon icon={faPaperPlane} className='text-xxl' style={{ color: 'white' }} />
            </Link>
            <Link href='Settings'>
                <FontAwesomeIcon icon={faGear} className='text-xxl' style={{ color: 'white' }} />
            </Link>
        </div>
    )
}