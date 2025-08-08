import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import AuthComponent from "../components/AuthComponent"
import Loader from "../components/Loader"

export default function ResetPassword() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const password = formData.get("password") as string
        const email = localStorage.getItem("recover_email")
        const secret = localStorage.getItem("otp_secret")

        if (!email || !secret) {
            Swal.fire({
                title: "Error",
                text: "Missing email or secret. Please start the recovery process again.",
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
            return
        }

        try {
            setLoading(true)
            await axios.put("https://task-manager-apis-t2dp.onrender.com/api/auth/update-password", {
                email,
                password,
                secret
            })

            localStorage.removeItem("recover_email")
            localStorage.removeItem("otp_secret")

            Swal.fire({
                title: "Success!",
                text: "Password has been reset. Please login now.",
                icon: "success",
                confirmButtonText: 'OK',
                confirmButtonColor: '#3754DB'
            })

            navigate("/")
        } 
        catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message + (err.response?.data?.data !== null ? ' - ' + err.response?.data?.data : ''),
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
        } 
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loader />}
            <AuthComponent register="reset password" handleSubmit={handleSubmit} />
        </>
    )
}
