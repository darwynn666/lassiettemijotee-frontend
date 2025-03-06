import styles from "@/styles/Home.module.css";
import { API_URL } from "@/features/utils/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";



export default function WebServiceStatus(props) {
    const { className } = props

    const [status, setStatus] = useState(false)
    const [refreshTrigger,setRefreshTrigger]=useState(true)

    // get backend status
    const getBackendStatus = async () => {
        const url = `${API_URL}/settings/wakeup`
        // console.log('GET', url)
        const response = await fetch(url)
        const data = await response.json()
        // console.log('getStatus()', data)
        if(data.online) setStatus(true)
    }

    // initialize refresh interval
    useEffect(() => {
        const i = setInterval(() => { setRefreshTrigger((trigger) => !trigger) }, 10_000)
        return () => clearInterval(i)
    }, [])

    // try to get status at every changes of refreshTrigger
    useEffect(() => {
        // console.log('getPendings()', refreshTrigger)
        getBackendStatus()
    }, [refreshTrigger])



    return (
        <>
            <FontAwesomeIcon icon={faCircle} className={`${className} ${status ? 'fg-green' : 'fg-red'}`} />
        </>
    )
}