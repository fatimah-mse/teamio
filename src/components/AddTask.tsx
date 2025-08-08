import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Loader from './Loader'
import TaskForm from './TaskForm'
import control from '../assets/imgs/Control.png'

export default function AddTask() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const AddTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const dueDate = formData.get("dueDate") as string
        const project = formData.get("project") as string
        const assignedTo = formData.get("assignedTo") as string
        const priority = formData.get("priority") as string

        const confirmResult = await Swal.fire({
            title: 'Add New Task',
            text: 'Are you sure you want to add this task ?',
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
                const token = localStorage.getItem("token")
                const response = await axios.post("https://task-manager-apis-t2dp.onrender.com/api/tasks/", {
                    title,
                    description,
                    dueDate,
                    priority,
                    status: "pending",
                    assignedTo,
                    project
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                await Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#3754DB'
                })

                navigate("/dashboard/tasks")
            } catch (err: any) {
                const errorMessage = err.response?.data?.message + (err.response?.data?.data ? ' - ' + err.response.data.data : '')
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
            } finally {
                setLoading(false)
            }
        }
    }


    return (
        <>
            {loading && <Loader />}
            <Link to={'/dashboard/tasks'}><img className='mb-10' src={control} alt="control" /></Link>
            <TaskForm type='add' handleSubmit={AddTask} />
        </>
    )
}
