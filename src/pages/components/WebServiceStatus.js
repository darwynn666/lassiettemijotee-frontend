import styles from "@/styles/Home.module.css";
import { API_URL } from "@/features/utils/utils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";



export default function WebServiceStatus(props) {
    const { className } = props

    const [status, setStatus] = useState(false)

    const getStatus = async () => {
        const url = `${API_URL}/settings/wakeup`
        console.log('GET', url)
        const response = await fetch(url)
        const data = await response.json()
        console.log('getStatus()', data)
        if(data.online) setStatus(true)
    }

    useEffect(() => {
        getStatus()
    }, [])


    return (
        <>
            <FontAwesomeIcon icon={faCircle} className={`${className} ${status ? 'fg-green' : 'fg-red'}`} />
        </>
    )
}