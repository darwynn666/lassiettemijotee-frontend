import styles from "@/styles/dashboard/WebServiceStatus.module.css";
import { API_URL } from "@/features/utils/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faHourglass, faCheck, faRotate } from "@fortawesome/free-solid-svg-icons";



export default function WebServiceStatus(props) {

    const [status, setStatus] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(true)

    // get backend status
    const getBackendStatus = async () => {
        const timestamp = new Date().getTime()
        const url = `${API_URL}/settings/wakeup/${timestamp}`
        // console.log('GET', url)
        const response = await fetch(url)
        const data = await response.json()
        // console.log('getStatus()', data)
        if (data.online) setStatus(true)
    }

    // initialize refresh interval
    useEffect(() => {
        const i = setInterval(() => { setRefreshTrigger((trigger) => !trigger) }, 5_000)
        return () => clearInterval(i)
    }, [])

    // try to get status at every changes of refreshTrigger
    useEffect(() => {
        getBackendStatus()
    }, [refreshTrigger])


    return (
        <>
            {props.display &&
                <div className={styles.main}>
                    <span>Web Service</span>
                    {status && <FontAwesomeIcon icon={faCheck} className='text-xl fg-green' />}
                    {!status && <FontAwesomeIcon icon={faRotate} className={`${styles.rotating} text-m fg-red`} />}
                </div>
            }
        </>
    )
}