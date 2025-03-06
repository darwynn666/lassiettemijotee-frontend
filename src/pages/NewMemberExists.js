import styles from "@/styles/NewMember.module.css";
import Link from "next/link";
import SiteHead from "./components/SiteHead";
import { useRouter } from "next/router";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function NewMemberExists() {
    const router = useRouter()
    const { firstname, email } = router.query


    return (
        <>
            <SiteHead>Oups...</SiteHead>
            <main className={styles.main}>

                <div className={styles.titleContainer}>
                    <span className='fg-green'>Pas si vite {firstname}...</span>
                </div>

                <div className={styles.imageContainer}>
                    <img src='sablier.png' className={styles.image}/>
                </div>

                <div className={styles.infosContainer}>
                    <span>Une adhésion (ou demande d'adhésion) existe déjà pour cette adresse mail cette année ({email?.toLowerCase()}).</span>
                    <span>Dirigez-vous en caisse pour régler votre cotisation si ce n'est pas déjà fait ou patientez l'année prochaine pour renouveler votre adhésion !</span>
                </div>

                <div className={styles.buttonsContainer}>
                    <Link href='/' className='button bg-green'>Retour</Link>
                </div>

            </main>
        </>
    )
}
