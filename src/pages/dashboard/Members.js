import styles from '@/styles/dashboard/Dashboard.module.css'
import Header from './components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL } from '@/features/utils/utils'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faSliders, faPlus, faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useAuthRedirect from '@/features/auth/useAuthRedirect'
import { getDateRange, toShortString } from '@/features/utils/utils'
import { fetchGetFilteredMembers } from '@/features/users/usersAPI'
// todo : remove pendings component from all files


export default function Members() {
    useAuthRedirect()
    const router = useRouter()
    const auth = useSelector((state) => state.auth.value)

    // console.log('filtersSlice', filtersSlice)


    const [members, setMembers] = useState([])
    const [period, setPeriod] = useState('week')
    const [periodString, setPeriodString] = useState('-')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const [displayFilters, setDisplayFilters] = useState(false)
    const [filterTypes, setFilterTypes] = useState(['client', 'volunteer', 'employee', 'external'])

    const [searchString, setSearchString] = useState(null)

    // get members filtered (period, types)
    const getMembers = async () => {
        const membersResult = await fetchGetFilteredMembers(auth.token, startDate, endDate, filterTypes)
        if (!membersResult.error) {
            // console.log('getMembers() inputs', period, startDate, endDate, types)
            // console.log('getMembers() response', membersResult)
            setMembers(membersResult || [])
        }
        else {
            console.log('getMembers() error', membersResult)
        }
    }

    // get initial dates
    useEffect(() => {
        const dateRange = getDateRange(new Date(), period)
        // console.log(dateRange)
        setStartDate(dateRange.startDate)
        setEndDate(dateRange.endDate)
    }, [period])

    useEffect(() => {
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        if (period === 'week') setPeriodString(toShortString(startDate) + ' - ' + toShortString(new Date(endDate.getTime() - 1000)))
        if (period === 'month') setPeriodString(monthNames[startDate.getMonth()] + ' ' + startDate.getFullYear())
        if (period === 'year') setPeriodString(startDate.getFullYear())
        getMembers()
    }, [startDate,filterTypes])



    // set a new display period
    const handleNavigatePeriod = (inc) => {
        let dateRange = {}
        if (period === 'week') {
            const newDate = new Date(startDate)
            newDate.setDate(startDate.getDate() + (inc * 7))
            // console.log(newDate)
            dateRange = getDateRange(newDate, period)
        }
        if (period === 'month') {
            const newDate = new Date(startDate)
            newDate.setMonth(startDate.getMonth() + (inc * 1))
            // console.log(newDate)
            dateRange = getDateRange(newDate, period)
        }
        if (period === 'year') {
            const newDate = new Date(startDate)
            newDate.setYear(startDate.getFullYear() + (inc * 1))
            // console.log(newDate)
            dateRange = getDateRange(newDate, period)
        }
        if (dateRange) {
            setStartDate(dateRange.startDate)
            setEndDate(dateRange.endDate)
        }
    }

    // toggle type in filterTypes array (push or slice)
    const toggleType = (type) => {
        const f = [...filterTypes]
        f.includes(type) ? f.splice(f.indexOf(type), 1) : f.push(type)
        setFilterTypes(f)
    }

    // filter the view by name, mail or city (no db query)
    const handleSearch = () => {
        const searchedMembers = members.filter(m => {
            if (
                m.firstname.toLowerCase().includes(searchString.toLowerCase()) ||
                m.lastname.toLowerCase().includes(searchString.toLowerCase()) ||
                m.email.toLowerCase().includes(searchString.toLowerCase()) ||
                m.city.toLowerCase().includes(searchString.toLowerCase())
            )
                return m
        })
        // console.log(searchedMembers)
        if (searchedMembers.length > 0) setMembers(searchedMembers)
    }

    // reset search string
    const handleResetSearchString = () => {
        setSearchString('')
        getMembers()
    }

    const membersCards = (Array.isArray(members) ? members : []).map((user, i) => {
        const nbYears = user.memberships.length
        const query = { userIndex: user.userIndex }
        // const isPending = user.memberships.map(m => m.some(e => e.amount === 0))[0]
        const isPending = user.memberships.some(m => m.some(e => e.amount === 0))

        // console.log('user', user, isPending)
        return (
            <div key={i} onClick={() => router.push({ pathname: 'EditMember', query })} className={styles.memberContainer}>
                <div className={styles.memberLeft}>
                    <div><span className={`text-xl ${isPending ? 'fg-red' : 'fg-green'}`}>{user.firstname} {user.lastname}</span></div>
                    <div><span>{user.email}</span></div>
                </div>
                <div className={styles.memberRight}>
                    <div><span className='text-xl'>{nbYears}</span></div>
                    <div><span>ans</span></div>
                </div>
            </div>
        )
    })


    // console.log(startDate.toISOString(), endDate.toISOString(), filterClients, filterVolunteers, filterEmployees, filterExternals, period)

    // console.log(startDate, endDate)

    // console.log('members', members)

    return (
        <>
            <Header></Header>
            {/* <Pendings></Pendings> */}
            <div className={styles.main}>

                <div className={styles.navigationContainer}>
                    <FontAwesomeIcon onClick={() => handleNavigatePeriod(-1)} icon={faChevronLeft} className='text-xl pointer fg-green' />
                    <div className={styles.timesContainer}>
                        <span>{periodString}</span>

                        {/* <div><span>2 adhésions (2€)</span></div> */}
                    </div>
                    <FontAwesomeIcon onClick={() => handleNavigatePeriod(+1)} icon={faChevronRight} className='text-xl pointer fg-green' />
                </div>

                <div className={styles.membersListContainer}>

                    {membersCards}

                </div>

                <div className={styles.filtersContainer}>
                    {displayFilters &&
                        <div className={styles.filtersOpenedContainer}>
                            <div>
                                <span>Affiner la recherche</span>
                                <FontAwesomeIcon onClick={() => setDisplayFilters(false)} icon={faXmark} className='text-xxl pointer fg-green' />
                            </div>
                            <div>
                                <button onClick={() => toggleType('client')} className={`smallButton ${filterTypes.includes('client') ? 'bg-green' : 'bg-lightgray'}`} style={{ marginRight: '5px' }}>Clients</button>
                                <button onClick={() => toggleType('volunteer')} className={`smallButton ${filterTypes.includes('volunteer') ? 'bg-green' : 'bg-lightgray'}`} style={{ marginRight: '5px' }}>Bénévoles</button>
                                <button onClick={() => toggleType('employee')} className={`smallButton ${filterTypes.includes('employee') ? 'bg-green' : 'bg-lightgray'}`} style={{ marginRight: '5px' }}>Employés</button>
                                <button onClick={() => toggleType('external')} className={`smallButton ${filterTypes.includes('external') ? 'bg-green' : 'bg-lightgray'}`}>Externes</button>
                            </div>
                            <div>
                                <button onClick={() => setPeriod('week')} className={`smallButton ${period === 'week' ? 'bg-green' : 'bg-lightgray'}`}>Semaine</button>
                                <button onClick={() => setPeriod('month')} className={`smallButton ${period === 'month' ? 'bg-green' : 'bg-lightgray'}`}>Mois</button>
                                <button onClick={() => setPeriod('year')} className={`smallButton ${period === 'year' ? 'bg-green' : 'bg-lightgray'}`}>Année</button>
                            </div>
                            <div>
                                <input onClick={() => handleResetSearchString()} onChange={(e) => setSearchString(e.target.value)} value={searchString} className='input' placeholder='nom, prénom, email, ville' />
                                <FontAwesomeIcon onClick={() => handleSearch()} icon={faMagnifyingGlass} className='text-xxl pointer fg-green' />
                            </div>
                        </div>
                    }
                    {!displayFilters &&
                        <div className={styles.filtersClosedContainer}>
                            <Link href='/NewMemberForm'>
                                <FontAwesomeIcon icon={faPlus} className='text-xl pointer fg-green' />
                            </Link>
                            <FontAwesomeIcon onClick={() => setDisplayFilters(true)} icon={faSliders} className='text-xl pointer fg-green' />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}