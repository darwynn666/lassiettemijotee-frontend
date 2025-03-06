import styles from "@/styles/WeekMenu.module.css";
import Link from "next/link";
import Image from "next/image";
import SiteHead from "./components/SiteHead";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MENU_IMAGE_URL } from "@/features/utils/utils";




export default function WeekMenu() {
    const router = useRouter()
    const [menuImageUrl, setMenuImageUrl] = useState(MENU_IMAGE_URL)

    return (
        <>
            <SiteHead>Menu de l'assiette</SiteHead>
            <main className={styles.main}>

                <div className={styles.titleContainer}>
                    <span>Menu de</span>
                    <span>la semaine</span>
                </div>

                <div className={styles.menuContainer}>
                    <Link href={`${MENU_IMAGE_URL}?${new Date().getTime()}`}>
                        <img src={`${MENU_IMAGE_URL}?${new Date().getTime()}`} className={styles.menu}></img>
                    </Link>
                </div>

                <div className={styles.infosContainer}>
                    <span>Cliquez sur le menu pour agrandir</span>
                </div>

                <div className={styles.buttonsContainer}>
                    <Link href='/' className='button bg-green'>Retour</Link>
                </div>

            </main>
        </>
    )
}
