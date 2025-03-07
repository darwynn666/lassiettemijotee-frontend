import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchVerifyToken } from "./authAPI";


export default function useAuthRedirect() {
    const auth = useSelector((state) => state.auth.value)
    const router = useRouter()
    // console.log('useAuthRedirect()',auth)

    useEffect(() => {
        const checkAuth = async () => {
            if (!auth.token) {
                router.push("/dashboard/Signin")
                return
            }
            const isValid = await fetchVerifyToken(auth)
            // console.log('Token', auth.token)
            if (!isValid) {
                router.push("/dashboard/Signin")
                return
            }
        }
        checkAuth()
    }, [auth, router])

}