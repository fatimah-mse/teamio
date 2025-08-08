import AuthComponent from "../components/AuthComponent"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from "sweetalert2"
import { useState } from "react"
import Loader from "../components/Loader"

export default function SignUp() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            setLoading(true)
            const response = await axios.post("https://task-manager-apis-t2dp.onrender.com/api/auth/signup", {
                name,
                email,
                password,
            })

            const { token } = response.data.data

            localStorage.setItem("token", token)
            localStorage.setItem("role", response.data.data.user.role)
            localStorage.setItem("userId", response.data.data.user.id)

            await Swal.fire({
                title: 'Success!',
                text: 'Your account has been created successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3754DB'
            })

            navigate("/dashboard")
        } catch (err: any) {
            const errorMessage = err.response?.data?.data
            Swal.fire({
                title: 'Error!',
                text: errorMessage.join(' - '),
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
            <AuthComponent register='sign up' handleSubmit={handleSubmit} />
        </>

    )
}