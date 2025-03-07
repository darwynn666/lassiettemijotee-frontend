import styles from "@/styles/NewMember.module.css";
import Link from "next/link";
import SiteHead from "./components/SiteHead";
import CityAutocomplete from "./components/CityAutocomplete";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchNewMember } from "@/features/users/usersAPI";
import { fetchPrices } from "@/features/settings/settingsAPI";
import { isValidEmail, isValidPhone } from "@/features/utils/utils";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUtensils } from "@fortawesome/free-solid-svg-icons";

export default function NewMemberForm() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [citySelected, setCitySelected] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [clientPrice, setClientPrice] = useState(0)

  const router = useRouter()

  useEffect(() => {
    (async () => {
      const prices = await fetchPrices()
      const price = await prices.filter(e => e.type === 'client').map(e => e.price)
      setClientPrice(price)
    })()
  }, [])

  const selectCity = (city) => {
    // console.log('select', city)
    setCity(city)
    setCitySelected(true)
  }

  const resetCity = () => {
    setCity('')
    setCitySelected(false)
  }

  const handleSubmit = async () => {
    setErrorMessage(null)

    // check form
    if (!firstname || !lastname || !email || !phone || !city) { setErrorMessage('Tous les champs sont obligatoires'); return }
    if (!citySelected) { setCity(''); setErrorMessage('Ville invalide'); return }

    if (!isValidEmail(email)) { setErrorMessage('Email invalide'); return }
    const formattedEmail = email.toLowerCase()
    if (!isValidPhone(phone)) { setErrorMessage('Numéro invalide'); return }
    const formattedPhone = phone[0] === '0' ? phone.replace(/^0/, '+33') : phone

    // fetch datas
    const response = await fetchNewMember(firstname, lastname, formattedEmail, formattedPhone, city)
    // console.log(response)
    if (response && response.newmember) {
      router.push({ pathname: 'NewMemberOk', query: { firstname } })
    }
    else {
      if (response.newyear) {
        router.push({ pathname: 'NewMemberRenew', query: { firstname } })
      }
      else {
        router.push({ pathname: 'NewMemberExists', query: { firstname, email } })
      }
    }
  }

  // console.log(city, citySelected)

  return (
    <>
      <SiteHead>Adhésion</SiteHead>
      <main className={styles.main}>

        <div className={styles.titleContainer}>
          <span className='fg-green'>Adhérez pour</span>
          <span className='fg-green'>{clientPrice}€ par an</span>
        </div>

        <div className={styles.formContainer}>
          <input onChange={(e) => setFirstname(e.target.value)} value={firstname} placeholder='prénom' className='input'></input>
          <input onChange={(e) => setLastname(e.target.value)} value={lastname} placeholder='nom' className='input'></input>
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email' className='input'></input>
          <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder='tél. portable' className='input'></input>
          <input onChange={(e) => setCity(e.target.value)}
            // onClick={() => resetCity()}
            onFocus={() => resetCity()}
            value={city} placeholder='ville' className='input'></input>
          {!citySelected && <CityAutocomplete filter={city} selectCity={selectCity} />}
          <div className={styles.errorMessage}>{errorMessage}</div>
        </div>

        <div className={styles.infosContainer}>
          <span>Une fois votre de demande envoyée, dirigez-vous vers la caisse pour régler votre cotisation.</span>
        </div>

        <div className={styles.buttonsContainer}>
          <button onClick={() => handleSubmit()} className='button bg-green'>Envoyer ma demande</button>
          <Link href='/' className='button bg-lightgray'>Retour</Link>
        </div>

      </main>
    </>
  )
}
