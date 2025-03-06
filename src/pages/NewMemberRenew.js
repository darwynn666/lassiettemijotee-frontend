import styles from "@/styles/NewMember.module.css";
import Link from "next/link";
import SiteHead from "./components/SiteHead";
import { useRouter } from "next/router";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function NewMemberRenew() {
    const router = useRouter()
    const { firstname } = router.query


    return (
        <>
            <SiteHead>De retour parmi nous</SiteHead>
            <main className={styles.main}>

                <div className={styles.titleContainer}>
                    <span className='fg-green'>Un an de plus ?</span>
                    <span className='fg-green'>Merci {firstname} !</span>
                </div>

                <div className={styles.imageContainer}>
                    <img src='trophee.png' className={styles.image}/>
                </div>

                <div className={styles.infosContainer}>
                    <span>Nous sommes ravis de vous revoir !</span>
                    <span>N'oubliez pas de régler votre cotisation en caisse.</span>
                </div>

                <div className={styles.buttonsContainer}>
                    <Link href='/' className='button bg-green'>Retour</Link>
                </div>

            </main>
        </>
    )
}
