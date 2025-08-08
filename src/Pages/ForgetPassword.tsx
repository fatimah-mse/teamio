import axios from "axios"
import AuthComponent from "../components/AuthComponent"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useState } from "react"
import Loader from "../components/Loader"


export default function ForgetPassword() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string

        try {
            setLoading(true)
            await axios.post("https://task-manager-apis-t2dp.onrender.com/api/auth/send-otp", {
                email
            })

            localStorage.setItem("recover_email", email)

            navigate("/otp")
        }
        catch (err: any) {
            const errorMessage = err.response?.data?.data
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
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
            <AuthComponent register='forget password' handleSubmit={handleSubmit} />
        </>
    )
}
