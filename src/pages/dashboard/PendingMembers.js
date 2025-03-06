import styles from '@/styles/dashboard/Dashboard.module.css'
import { REFRESH_PENDINGS_INTERVAL } from '@/features/utils/utils'
import Header from './components/Header'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL } from '@/features/utils/utils'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import useAuthRedirect from '@/features/auth/useAuthRedirect'
import { fetchGetPendingMembersList } from '@/features/users/usersAPI'


export default function PendingMembers() {
    useAuthRedirect()
    const router = useRouter()
    const auth = useSelector((state) => state.auth.value)

    const [pendingMembers, setPendingMembers] = useState([])
    const [refreshTrigger, setRefreshTrigger] = useState(true)

    // initialize refresh interval
    useEffect(() => {
        const i = setInterval(() => { setRefreshTrigger((trigger) => !trigger) }, REFRESH_PENDINGS_INTERVAL)
        return () => clearInterval(i)
    }, [])

    // refresh pendings every REFRESH_PENDINGS_INTERVAL ms
    useEffect(() => {
        // console.log('getPendingMembers()', refreshTrigger)
        getPendingMembers()
    }, [refreshTrigger])

    // get pending memberships
    const getPendingMembers = async () => {
        try {
            const result = await fetchGetPendingMembersList(auth.token)
            // console.log('pendings', await result)
            setPendingMembers(await result.members || [])
        }
        catch (err) {
            console.log('error while getting list', err)
            return false
        }
    }



    const memberCards = pendingMembers.map((member, i) => {
        const query = member
        return (
            <div
                key={i}
                onClick={() => router.push({ pathname: 'RegisterMember', query })}
                className={styles.pendingMember}>
                <FontAwesomeIcon icon={faUser} className='text-xxl pointer fg-green' />
                <span className='text-xl'>{member.fullname}</span>
                <span className='fg-red'>{member.pendingDays} jours</span>
            </div>
        )
    })

    return (
        <>
            <div className={styles.main}>

                <div className={styles.titleContainer}>
                    <span>Adhésions en attente</span>
                </div>

                {pendingMembers.length === 0 &&
                    <div className={styles.pendingsEmptyContainer}>
                        <span>La liste est vide</span>
                    </div>
                }

                {pendingMembers.length > 0 &&
                    <div className={styles.pendingMembersContainer}>
                        {memberCards}
                    </div>
                }

                <div className={styles.buttonsContainer}>
                    <Link href='/dashboard/Members' className='button bg-lightgray'>Retour</Link>
                </div>

            </div>
        </>
    )
}