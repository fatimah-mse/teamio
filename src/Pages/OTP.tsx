import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import AuthComponent from "../components/AuthComponent"
import Loader from "../components/Loader"

export default function OTP() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const inputRefs = useRef<HTMLInputElement[]>([])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const otp = inputRefs.current.map(input => input?.value).join('')
        const email = localStorage.getItem("recover_email")

        if (!email) {
            Swal.fire({
                title: "Error",
                text: "No email found. Please start again.",
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
            return
        }

        if (otp.length !== 6) {
            Swal.fire({
                title: "Error",
                text: "Please enter all 6 digits",
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
            return
        }

        try {
            setLoading(true)
            const res = await axios.post("https://task-manager-apis-t2dp.onrender.com/api/auth/check-otp", {
                email,
                otp
            })

            const { secret } = res.data.data
            console.log(res)
            localStorage.setItem("otp_secret", secret)

            navigate("/reset-password")

        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message,
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
            <AuthComponent register="otp" handleSubmit={handleSubmit} inputRefs={inputRefs} />
        </>
    )
}
