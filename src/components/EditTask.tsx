import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import Loader from './Loader'
import TaskForm from './TaskForm'
import control from '../assets/imgs/Control.png'

interface TaskData {
    title: string
    description: string
    dueDate: string
    priority: string
    status: string
    assignedTo: { _id: string; name: string; email: string }
    project: { _id: string; name: string; email: string }
}

export default function EditTask() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [taskData, setTaskData] = useState<TaskData | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                let task = response.data.data

                if (task.dueDate) {
                    task.dueDate = task.dueDate.split('T')[0]
                }

                setTaskData(task)
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch task data.',
                    icon: 'error',
                    confirmButtonColor: '#3754DB'
                })
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchTask()
    }, [id])

    const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!taskData) return

        const formData = new FormData(e.currentTarget)

        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const dueDate = formData.get("dueDate") as string
        const project = formData.get("project") as string
        const assignedTo = formData.get("assignedTo") as string
        const priority = formData.get("priority") as string
        const status = formData.get("status") as string

        const taskProjectId = typeof taskData.project === 'string'
            ? taskData.project
            : taskData.project?._id || ''

        const taskAssignedToId = typeof taskData.assignedTo === 'string'
            ? taskData.assignedTo
            : taskData.assignedTo?._id || ''

        const formatDate = (dateStr: string) => dateStr.split('T')[0]

        const payload: any = {}

        if (title !== taskData.title) payload.title = title
        if (description !== taskData.description) payload.description = description

        if (dueDate !== '' && formatDate(taskData.dueDate) !== dueDate) {
            payload.dueDate = dueDate
        }
        else if (dueDate === '' && taskData.dueDate !== '') {
            payload.dueDate = ''
        }

        if (project !== taskProjectId) payload.project = project
        if (assignedTo !== taskAssignedToId) payload.assignedTo = assignedTo
        if (priority !== taskData.priority) payload.priority = priority
        if (status !== taskData.status) payload.status = status

        const confirmResult = await Swal.fire({
            title: 'Edit Task',
            text: 'Are you sure you want to update this task?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Update it!',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })

        if (confirmResult.isConfirmed) {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const response = await axios.put(`https://task-manager-apis-t2dp.onrender.com/api/tasks/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                await Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#3754DB'
                })

                navigate('/dashboard/tasks')
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
            <div className='flex justify-between gap-3 max-576:flex-col mb-5'>
                <Link to={`/dashboard/show-task/${id}`}><img src={control} alt="control" /></Link>
            </div>
            {taskData &&
                <TaskForm
                    type="edit"
                    initialData={taskData}
                    handleSubmit={handleEditTask}
                />
            }
        </>
    )
}
