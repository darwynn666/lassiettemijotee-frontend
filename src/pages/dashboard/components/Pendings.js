import styles from '@/styles/dashboard/Pendings.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchGetPendingMembersList } from '@/features/users/usersAPI'

export default function Pendings() {
    const [nbPendings, setNbPendings] = useState()
    const auth = useSelector((state) => state.auth.value)

    useEffect(() => {
        (async () => {
            try {
                const result = await fetchGetPendingMembersList(auth.token)
                // console.log('result', await result)
                setNbPendings(await result.pendings)
            }
            catch (err) {
                console.log('error while getting list', err)
                return false
            }
        })()
    }, [])

    return (
        <div className={`${styles.main} ${nbPendings > 0 ? 'bg-red' : 'bg-lightgray'}`}>
            <Link href={nbPendings > 0 ? 'PendingMembers' : 'Members'} className='pointer'>{nbPendings} adhésions en attente</Link>
        </div >
    )
}