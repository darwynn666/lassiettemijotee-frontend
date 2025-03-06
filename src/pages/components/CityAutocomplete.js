import styles from '@/styles/CityAutocomplete.module.css'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";




export default function CityAutocomplete(props) {
    const { filter } = props
    console.log(filter)

    const router = useRouter()

    const [cities, setCities] = useState([])

    useEffect(() => {
        const getCities = async () => {
            // https://geo.api.gouv.fr/communes?nom=lille&format=json
            const url = `https://geo.api.gouv.fr/communes?nom=${encodeURI(filter)}&boost=population&limit=3&format=json`
            console.log('GET', url)
            const response = await fetch(url)
            const cities = await response.json()
            // console.log(cities)
            setCities(cities)
        }
        getCities()
    }, [filter])

    const handleSelectCity = (city) => {
        // console.log('selected', city)
        props.selectCity(`${city.nom} (${city.codeDepartement})`)
        // setCities([])
    }


    const citiesCards = cities.map((c, i) => {
        return (
            <div key={i} onClick={() => handleSelectCity(c)} className={styles.cityContainer}>
                <span>{c.nom} ({c.codeDepartement})</span>
            </div>
        )
    })

    console.log(cities)

    if (!cities.length) return

    return (
        <>
            <div className={styles.main}>
                <div className={styles.labelContainer}><span>Selectionnez une ville</span></div>
                <div className={styles.citiesContainer}>
                    {citiesCards}
                </div>
            </div>
        </>
    )
}