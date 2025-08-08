import axios from "axios"
import AuthComponent from "../components/AuthComponent"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import Loader from "../components/Loader"
import { useState } from "react"

export default function Login() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            setLoading(true)
            const response = await axios.post("https://task-manager-apis-t2dp.onrender.com/api/auth/login", {
                email,
                password,
            })

            const { token } = response.data.data

            localStorage.setItem("token", token)
            localStorage.setItem("userId", response.data.data.user.id)
            localStorage.setItem("username", response.data.data.user.name)
            localStorage.setItem("role", response.data.data.user.role)

            await Swal.fire({
                title: 'Success!',
                text: response?.data?.message,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3754DB',
                cancelButtonColor: '#FBBE37'
            })

            navigate("/dashboard")
        } catch (err: any) {
            const errorMessage = err.response?.data?.message
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB',
                cancelButtonColor: '#FBBE37'
            })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loader />}
            <AuthComponent register='login' handleSubmit={handleSubmit} />
        </>
    )

}