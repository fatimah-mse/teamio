import { useEffect, useState } from 'react'
import ProjectForm from './ProjectForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loader from './Loader'
import Calendar from 'react-calendar'
import control from '../assets/imgs/Control.png'

export default function EditProject() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [project, setProject] = useState<any | null>(null)
    const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()])

    useEffect(() => {
        fetchProject()
    }, [id])

    const fetchProject = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (token) {
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })

                const project = response.data.data

                if (project.startDate) {
                    project.startDate = project.startDate.split('T')[0]
                }

                if (project.endDate) {
                    project.endDate = project.endDate.split('T')[0]
                }

                setProject(response.data.data)

                if (response.data.data?.startDate && response.data.data?.endDate) {
                    setDateRange([
                        new Date(response.data.data.startDate),
                        new Date(response.data.data.endDate)
                    ])
                }
            }
        } catch (err: any) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message,
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
        } finally {
            setLoading(false)
        }
    }

    const Edit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const startDate = formData.get("startDate") as string
        const endDate = formData.get("endDate") as string

        const confirmResult = await Swal.fire({
            title: 'Update Project',
            text: 'Are you sure  you want to update this new project ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })

        if (confirmResult.isConfirmed) {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const response = await axios.put(`https://task-manager-apis-t2dp.onrender.com/api/projects/${id}`, {
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
            {project && (
                <div className=''>
                    <Link to={`/dashboard/show-project/${id}`}><img className='mb-10' src={control} alt="control" /></Link>
                    <span className='text-gray-600 font-bold underline underline-offset-2 mb-2 block'>Project TimeLine :</span>
                    <Calendar
                        selectRange={false}
                        value={dateRange}
                        className="border-0 mb-4 !max-w-72 md:!w-[45%] !w-full rounded-md bg-mybg"
                        tileClassName="hover:bg-myPrimary/50"
                    />
                    <ProjectForm
                        type='edit'
                        initialData={project}
                        handleSubmit={Edit}
                    />
                </div>

            )}
        </>
    )
}
