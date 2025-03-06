import { API_URL } from "@/features/utils/utils";

// sends admin password
export const fetchLoginAdmin = async (password) => {
    try {
        const url = `${API_URL}/auth/login`
        // console.log('POST', url, password)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })
        const data = await response.json()
        // console.log('fetchAPI response', data)
        return data
    }
    catch (err) {
        console.log('fetchLoginAdmin error', err)
    }
}

// check admin connexion 
// returns true or false
export const fetchVerifyToken = async (auth) => {
    // console.log('fetchVerifyToken()', auth)

    try {
        const url = `${API_URL}/auth/verify`
        // console.log('POST', url)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${auth.token}>` },
        })
        if (response.status === 200) {
            // console.log('fetchVerifyToken ok', response)
            return true
        }
        else {
            console.log('fetchVerifyToken error', response)
            return false
        }

        // return true
    }
    catch (err) {
        console.log('fetchIsConnected error', err)
        return false
    }

}

