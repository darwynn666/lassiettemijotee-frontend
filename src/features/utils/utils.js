/* CONSTANTS */

// export const API_URL = "http://192.168.1.147:3000"
export const API_URL = "https://lassiettemijotee-backend.onrender.com"
export const MENU_IMAGE_URL = '/images/menu.jpg'
export const REFRESH_PENDINGS_INTERVAL = 5_000 // ms



/* FUNCTIONS */

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+33|0)[1234567]\d{8}$/
    return phoneRegex.test(phone)
}

// gets a range of date depending of the 'date' and 'period' params
// date = js date
// period = 'week' || 'month' || 'year'
// returns { period, startDate, endDate }
export const getDateRange = (date, period) => {
    const startDate = new Date(date)
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    let endDate = new Date(startDate)
    // period = week (mon-sun) || month (1-31) || year (01/01-31/12)
    if (period === 'week') {
        const dayOfWeek = startDate.getDay()
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        startDate.setDate(startDate.getDate() - diff)
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 7)
    }
    if (period === 'month') {
        startDate.setDate(1)
        endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 1)
    }
    if (period === 'year') {
        startDate.setDate(1)
        startDate.setMonth(0)
        endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 12)
    }
    // console.log('getDateRange',period,startDate,endDate)
    return { period, startDate, endDate }
}

// converts a JS date into a short string : date => 'Lun 01 Jan'
export const toShortString = (date) => {
    // console.log('toShortString',date)
    const myDate = new Date(date)
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const monthNames = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
    // console.log(myDate.getDay(),myDate.getDate(),myDate.getMonth())
    const result = dayNames[myDate.getDay()] + ' ' + myDate.getDate() + ' ' + monthNames[myDate.getMonth()]// + ' ' + myDate.getFullYear()
    // console.log(result)
    return result
}