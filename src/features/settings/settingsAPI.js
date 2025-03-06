import { API_URL } from "@/features/utils/utils";

// get settings
export const fetchGetSettings = async (token) => {

    try {
        const url = `${API_URL}/settings`
        console.log('GET', url)
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
        })
        const data = await response.json()
        // console.log('data', data)

        if (response.status === 200) {
            // console.log('success to get settings', data)
            return data
        }
        else {
            console.log('fetchGetSettings() error', data)
        }
    }
    catch (err) {
        console.log('fetchGetSettings() error', err)
        return false
    }

}

// set settings
export const fetchSetSettings = async (credentials) => {
    const { token, ...body } = credentials
    // console.log(token, body)

    try {
        const url = `${API_URL}/settings`
        console.log('PUT', url)
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
            body: JSON.stringify(body),
        })
        const data = await response.json()
        console.log('data', data)

        if (response.status === 200) {
            // console.log('success while fetching settings', data)
            return true
        }
        else {
            console.log('fetchSetSettings() error', data)
            return false
        }
    }
    catch (err) {
        console.log('fetchSetSettings() error', err)
        return false
    }

}

// upload image menu
export const fetchSetImage = async (formData) => {
    console.log('fetchSetImage', formData)

    try {
        const url = `${API_URL}/settings/menu`
        console.log('POST', url)
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        })
        const data = await response.json()
        if (response.status !== 200) {
            // console.log('fetchSetImage() success', data)
            return false
        }
        else {
            return true
        }
    }
    catch (err) {
        console.log('fetchSetImage() error', err)
    }
}


export const fetchPrices = async () => {
    try {
        const url = `${API_URL}/settings/getprices`
        // console.log('GET', url)
        const response = await fetch(url)
        const data = await response.json()
        if(response.status ===200) {
            // console.log('fetchPrices() success', data)
            return data
        }
        else {
            console.log('fetchPrices() error', response)
            return false
        }
    }
    catch (err) {
        console.log('fetchPrices() error', err)
    }
}