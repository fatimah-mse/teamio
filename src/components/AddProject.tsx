import { useState } from 'react'
import ProjectForm from './ProjectForm'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loader from './Loader'
import control from '../assets/imgs/Control.png'

export default function AddProject() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const Add = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const startDate = formData.get("startDate") as string
        const endDate = formData.get("endDate") as string

        const confirmResult = await Swal.fire({
            title: 'Add New Project',
            text: 'Are you sure  you want to add this new project ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add it!',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })

        if (confirmResult.isConfirmed) {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const response = await axios.post("https://task-manager-apis-t2dp.onrender.com/api/projects/", {
                    name,
                    description,
                    startDate,
                    endDate
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

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
                const errorMessage = err.response?.data?.message + (err.response?.data?.data !== null ? ' - ' + err.response?.data?.data : '')
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
    }

    return (
        <>
            {loading && <Loader />}
            <Link to={'/dashboard'}><img className='mb-10' src={control} alt="control" /></Link>
            <ProjectForm type='add' handleSubmit={Add} />
        </>
    )
}
