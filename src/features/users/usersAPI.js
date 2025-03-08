import { API_URL } from "@/features/utils/utils";

export const fetchNewMember = async (firstname, lastname, email, phone, city) => {

    try {
        const url = `${API_URL}/users/new`
        console.log('POST', url)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, lastname, email, phone, city }),
        })
        const data = await response.json()
        // console.log(data)
        return data
    }
    catch (err) {
        console.log('fetchNewMember() error', err)
        return false
    }


}

// get pending memberships list [{ fullname, pendingdays }]
// returns { pendings : 0, members : [ { fullname, pendingdays }, ... ] }
export const fetchGetPendingMembersList = async (token) => {
    try {
        const url = `${API_URL}/users/getpendingmemberslist`
        // console.log('GET', url)
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
        })
        const data = await response.json()
        // console.log('fetchGetPendingMembersList()', data)
        if (response.status === 200) return data
        else return { error: response }
    }
    catch (err) {
        console.log('fetchGetPendingMembersList() error', err)
        return false
    }

}


// confirm new memberships (set amount = price) to userid
// + update user details after human verification
export const fetchConfirmNewMembership = async (token, firstname, lastname, email, phone, city, amount, type, userIndex, membershipsIndex) => {
    try {
        const url = `${API_URL}/users/setdetails/${userIndex}`
        // console.log('PUT', url)
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
            body: JSON.stringify({ firstname, lastname, email, phone, city })
        })
        const data = await response.json()
        if (response.status === 200) {
            // console.log('update user ok', data)
            try {

                const url = `${API_URL}/users/confirmmemberships/${userIndex}/${membershipsIndex}`
                // console.log('PUT', url)
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
                    body: JSON.stringify({ amount, type })
                })
                const data = await response.json()
                // console.log(data)
                if (response.status === 200) {
                    // console.log('update memberships ok', data)
                }
                else {
                    console.log('fetchConfirmNewMembership() error', url, response)
                    return false
                }
            }
            catch (err) {
                console.log('fetchConfirmNewMembership() error', err)
                return false
            }

        }
        else {
            console.log('fetchConfirmNewMembership() error', url, response)
        }


        const url2 = `${API_URL}/`
        return true
    }
    catch (err) {
        console.log('fetchConfirmNewMembership() error', err)
    }
}

export const fetchCancelNewMembership = async (token, userIndex, membershipIndex) => {
    try {
        const url = `${API_URL}/users/cancelmembership/${userIndex}/${membershipIndex}`
        console.log('DELETE', url)
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
            body: JSON.stringify({ userIndex, membershipIndex })
        })
        const data = await response.json()
        if (response.status === 200) {
            // console.log('fetchCancelNewMembership() success', data)
            return true
        }
        else {
            console.log('fetchCancelNewMembership() error', response)
            return false
        }
    }
    catch (err) {
        console.log('fetchCancelNewMembership() error', err)
    }
}

// get members by filters
export const fetchGetFilteredMembers = async (token, startDate, endDate, types) => {
    // console.log('fetchGetFilteredMembers', startDate, endDate, types)
    try {
        const url = `${API_URL}/users/getfilteredmembers`
        // console.log('POST', url)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
            body: JSON.stringify({ startDate, endDate, types })
        })
        const data = await response.json()
        // console.log('fetchGetFilteredMembers()', data)
        return data
    }
    catch (err) {
        console.log('fetchGetFilteredMembers() error', err)
        return false
    }
}

// get an user by id
export const fetchGetUserById = async (token, userIndex) => {
    // console.log('fetchGetUserById', userIndex)
    if (!userIndex) userIndex = 0
    try {
        const url = `${API_URL}/users/${userIndex}`
        // console.log('GET', url)
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
        })
        const data = await response.json()
        // console.log('fetchGetUserById() success', data)
        return data
    }
    catch (err) {
        console.log('fetchGetUserById() error', err)
        return false
    }
}


// set users details and memberships to db
export const fetchSetUser = async (token, firstname, lastname, email, phone, city, memberships, userIndex) => {
    // 2 fetch (2 routes) :
    // set user details + set user memberships
    try {
        const url1 = `${API_URL}/users/setdetails/${userIndex}`
        const url2 = `${API_URL}/users/setmemberships/${userIndex}`
        // console.log('PUT', url1)
        // console.log('PUT', url2)
        const fetch1 = fetch(url1, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
            body: JSON.stringify({ firstname, lastname, email, phone, city })
        })
        const fetch2 = fetch(url2, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
            body: JSON.stringify({ memberships })
        })
        const responses = await Promise.all([fetch1, fetch2])
        // console.log(responses)
        const datas = await Promise.all(responses.map(e => e.json()))
        return !datas.some(e => e.error)
    }
    catch (err) {
        console.log('fetchSetUser() error', err)
        return false
    }
}

// detete user by id
export const fetchDeleteUser = async (token, userIndex) => {
    try {
        const url = `${API_URL}/users/${userIndex}`
        console.log('DELETE', url)
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
        })
        const data = await response.json()
        if (response.status === 200) {
            // console.log('fetchDeleteUser() success', data)
            return true
        }
        else {
            console.log('fetchDeleteUser() error', data)
            return false
        }
    }
    catch (err) {
        console.log('fetchDeleteUSer() error', err)
        return false
    }
}

// get all users
export const fetchGetAllUsers = async (token) => {
    try {
        const url = `${API_URL}/users`
        console.log('GET', url)
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer <${token}>` },
        })
        const data = await response.json()
        // console.log('getAllUsers() success', data)
        return data
    }
    catch (err) {
        console.log('getAllUsers() error', err)
    }
}

