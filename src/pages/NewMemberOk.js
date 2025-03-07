import styles from "@/styles/NewMember.module.css";
import Link from "next/link";
import SiteHead from "./components/SiteHead";
import { useRouter } from "next/router";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function NewMemberOk() {
    const router = useRouter()
    const { firstname } = router.query


    return (
        <>
            <SiteHead>Merci de votre soutien</SiteHead>
            <main className={styles.main}>

                <div className={styles.titleContainer}>
                    <span className='fg-green'>Merci {firstname}</span>
                    <span className='fg-green'>C'est presque</span>
                    <span className='fg-green'>fini !</span>
                </div>

                <div className={styles.imageContainer}>
                    <img src='/images/trophee.png' className={styles.image} alt='Merci'/>
                </div>

                <div className={styles.infosContainer}>
                    <span>Pour terminer votre adhésion, merci de régler votre cotisation en caisse en précisant votre nom.</span>
                </div>

                <div className={styles.buttonsContainer}>
                    <Link href='/' className='button bg-green'>Retour</Link>
                </div>

            </main>
        </>
    )
}
