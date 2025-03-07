import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import SiteHead from "./components/SiteHead";
import WebServiceStatus from "./components/WebServiceStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Home() {





  return (
    <>
      <SiteHead>L'assiette Mijotée</SiteHead>
      <main className={styles.main}>

        <div className={styles.headerContainer}>
          <span className='pointer'>
            <Link href='dashboard/Members'>
              <WebServiceStatus display={false} />
              <FontAwesomeIcon icon={faUtensils} className='text-xxl dashboardLink' />
            </Link>
          </span>
        </div>

        <div className={styles.titleContainer}>
          <span>Bienvenue à</span>
          <span>l'Assiette Mijotée !</span>
        </div>

        <div className={styles.logoContainer}>
          <img src='logo.png' className={styles.logo} alt='Logo'></img>
        </div>

        <div className={styles.infosContainer}>
          <span>Profitez-en pour adhérer à l'association ou renouveler votre adhésion annuelle.</span>
        </div>

        <div className={styles.buttonsContainer}>
          <Link href='NewMemberForm' className='button bg-green'>Adhésion</Link>
          <Link href='WeekMenu' className='button bg-orange'>Menu de la semaine</Link>
        </div>

      </main>
    </>
  )
}
