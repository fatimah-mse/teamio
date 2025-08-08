import { Link, useNavigate, useParams } from 'react-router-dom'
import control from '../assets/imgs/Control.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faClock, faEdit, faEye, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Loader from './Loader'
import Handel from './Handel'
import DigitalTimer from './DigitalTimer'
import img from '../assets/imgs/task.png'
import { faAdd, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { timeAgo } from '../helpers/helpers'

export default function ShowTask() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [task, setTask] = useState<any | null>(null)
    const [notes, setNotes] = useState<any | null>(null)
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchTask()
        fetchTaskNotes()
    }, [id])

    const fetchTask = async () => {
        try {
            setLoading(true)
            if (token) {
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                setTask(response.data.data)
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

    const fetchTaskNotes = async () => {
        try {
            setLoading(true)
            if (token) {
                const response = await axios.get(`https://task-manager-apis-t2dp.onrender.com/api/notes/task/${id}?sort=desc`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                setNotes(response.data.data)
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

    const HandelAdd = async () => {
        const result = await Swal.fire({
            title: 'Add New Note',
            input: 'textarea',
            inputPlaceholder: 'Write your note here...',
            showCancelButton: true,
            confirmButtonText: 'Add',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })

        if (result.isConfirmed) {
            try {
                setLoading(true)
                if (token) {
                    const content = result.value?.trim()
                    const response = await axios.post(`https://task-manager-apis-t2dp.onrender.com/api/notes/`,
                        { content, task: id },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            params: { t: Date.now() }
                        }
                    )

                    Swal.fire({
                        title: 'Success!',
                        text: response?.data?.message,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3754DB',
                        cancelButtonColor: '#FBBE37'
                    })

                    fetchTaskNotes()
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
    }

    const handleEdit = async (status: string) => {
        switch (status) {
            case 'pending':
                status = 'in progress'
                break
            case 'in progress':
                status = 'completed'
                break
        }

        try {
            setLoading(true)
            if (token) {
                const response = await axios.put(`https://task-manager-apis-t2dp.onrender.com/api/tasks/${id}`,
                    {
                        status
                    }, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { t: Date.now() }
                })
                await Swal.fire({
                    title: 'Success!',
                    text: response?.data?.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
                navigate("/dashboard/tasks")
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

    const handleGet = (note: any) => {
        Swal.fire({
            title: `<span style="color:#3754DB; font-weight:bold;">Note Details</span>`,
            html: `
                <p class="text-base mb-2 font-bold">
                    <strong>Content:</strong> ${note?.content}
                </p>
                <p class="text-sm text-gray-500">
                    <strong>By:</strong> ${note?.author?.name}
                </p>
                <div class="flex justify-end gap-2 mt-10">
                    <button id="editNoteBtn" class="bg-indigo-100 px-3 py-2 rounded-md border-none cursor-pointer">
                    <span class="font-semibold text-indigo-700 text-sm">Edit</span>
                    </button>
                    <button id="deleteNoteBtn" class="bg-red-200 px-3 py-2 rounded-md border-none cursor-pointer">
                    <span class="font-semibold text-red-500 text-sm">Delete</span>
                    </button>
                    <button id="closeNoteBtn" class="bg-yellow-400 px-3 py-2 rounded-md border-none text-gray-800 text-sm cursor-pointer font-semibold">
                    Cancel
                    </button>
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: false,
            showDenyButton: false,
            didRender: () => {
                document.getElementById("editNoteBtn")?.addEventListener("click", () => {
                    Swal.fire({
                        title: "Edit Note",
                        input: "text",
                        inputValue: note?.content,
                        showCancelButton: true,
                        cancelButtonColor: '#FBBE37',
                        confirmButtonText: "Save",
                        confirmButtonColor: "#3754DB",
                    }).then((editResult) => {
                        const newContent = editResult.value?.trim()
                        if (editResult.isConfirmed && newContent) {
                            handleUpdateNote(note._id, newContent)
                        }
                    })
                })

                document.getElementById("deleteNoteBtn")?.addEventListener("click", () => {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "This note will be deleted!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, delete it!",
                        confirmButtonColor: "#F87171",
                    }).then((deleteResult) => {
                        if (deleteResult.isConfirmed) {
                            handleDeleteNote(note._id)
                        }
                    })
                })

                document.getElementById("closeNoteBtn")?.addEventListener("click", () => {
                    Swal.close()
                })
            }
        })
    }

    const handleUpdateNote = async (noteId: string, newContent: string) => {
        try {
            setLoading(true)
            if (token) {
                const response = await axios.put(
                    `https://task-manager-apis-t2dp.onrender.com/api/notes/${noteId}`,
                    { content: newContent },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                setNotes((prev: any) =>
                    prev.map((n: any) =>
                        n._id === noteId ? { ...n, content: newContent } : n
                    )
                )
                await Swal.fire({
                    title: 'Success!',
                    text: response?.data?.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
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

    const handleDeleteNote = async (noteId: string) => {
        try {
            setLoading(true)
            if (token) {
                const response = await axios.delete(
                    `https://task-manager-apis-t2dp.onrender.com/api/notes/${noteId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                setNotes((prev: any) =>
                    prev.filter((n: any) => n._id !== noteId)
                )
                await Swal.fire({
                    title: 'Success!',
                    text: response?.data?.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3754DB',
                    cancelButtonColor: '#FBBE37'
                })
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

    const handelDeleteTask = async () => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to Delete this Task.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#3754DB',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#FBBE37'
        })
        if (confirmResult.isConfirmed) {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                if (token) {
                    const response = await axios.delete(`https://task-manager-apis-t2dp.onrender.com/api/tasks/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { t: Date.now() }
                    })

                    const successMessage = response.data?.message

                    await Swal.fire({
                        title: 'Success!',
                        text: successMessage,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3754DB',
                        cancelButtonColor: '#FBBE37'
                    })
                    navigate('/dashboard/tasks')
                }

            }
            catch (err: any) {
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

    }

    if (loading) return <Loader />
    if (!task) return <Handel txt='Task' />

    return (
        <>
            <div className='flex justify-between gap-3 max-576:flex-col mb-5'>
                <Link to={'/dashboard/tasks'}><img src={control} alt="control" /></Link>
                {task.status !== 'completed' &&
                    <DigitalTimer initialSeconds={Math.max(0, Math.floor((new Date(task.dueDate).getTime() - Date.now()) / 1000))} />
                }
            </div>

            {role === 'admin' &&
                <div className='flex justify-end gap-2 mb-8'>
                    <Link to={`/dashboard/edit-task/${id}`} className='p-3 rounded-md bg-indigo-200 font-semibold text-gray-700 hover:opacity-80 transition-all duration-500 ease-in-out'>
                        <FontAwesomeIcon className='text-indigo-700 text-xl' icon={faEdit} />
                    </Link>
                    <button onClick={handelDeleteTask} className='px-4 py-2 rounded-md bg-red-200 font-semibold text-mybg hover:opacity-80 transition-all duration-500 ease-in-out'>
                        <FontAwesomeIcon className='text-red-500 text-xl' icon={faTrashAlt} />
                    </button>
                </div>
            }

            <div className="flex flex-wrap justify-between h-full gap-5">

                <div className='md:w-[45%] w-full'>
                    <span className='text-gray-600 font-bold underline underline-offset-2'>Task Title :</span>
                    <h1 className="text-2xl font-bold mb-8 font-winky-rough text-myPrimary">
                        {task.title}
                    </h1>

                    <span className='text-gray-600 font-bold underline underline-offset-2'>Task Description :</span>
                    <p className="font-bold text-gray-800 mb-8">{task.description}</p>

                    <span className='text-gray-600 font-bold underline underline-offset-2'>Task Priority :</span>
                    <p className="font-bold text-gray-800 mb-8">{task.priority}</p>

                    <span className='text-gray-600 font-bold underline underline-offset-2'>Task Status :</span>
                    <p className={`font-bold mb-8 w-max rounded-md
                            ${task.status === 'pending' && 'text-amber-400'}
                            ${task.status === 'in progress' && 'text-myPrimary'}
                            ${task.status === 'completed' && 'text-green-500'}
                            ${task.status === 'postponed' && '!text-red-500'}
                    `}>
                        {task.status}
                    </p>

                    <span className='text-gray-600 font-bold underline underline-offset-2'>Assigned To :</span>
                    <p className="font-bold text-gray-800 mb-8">{task.assignedTo.name}</p>

                    <span className='text-gray-600 font-bold underline underline-offset-2'>Belongs to Project :</span>
                    <p className="font-bold text-gray-800 mb-8">{task.project.name}</p>

                </div>
                <div className='md:w-[45%] w-full'>
                    <div className='flex gap-3 h-max'>
                        <img className='h-max' src={img} alt="img" />
                        <div className='flex flex-col justify-between'>
                            <p className='flex flex-col'>
                                <span className='text-sm text-gray-600 font-medium'>Date Created</span>
                                <span className='font-bold text-gray-800'>{task.createdAt.split('T')[0]}</span>
                            </p>
                            <p className='flex flex-col'>
                                <span className='text-sm text-gray-600 font-medium'>Due Date</span>
                                <span className='font-bold text-gray-800'>{task.dueDate.split('T')[0]}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        disabled={task.status === 'postponed' || task.status === 'completed'}
                        onClick={() => handleEdit(task.status)}
                        className={` mt-10
                            ${task.status === 'pending' && 'px-3 py-2 bg-indigo-600 text-indigo-100 rounded-md'}
                            ${task.status === 'in progress' && 'px-3 py-2 bg-green-500 text-green-100 rounded-md'}
                            ${task.status === 'completed' && 'text-green-500 rounded-md font-bold'}
                            ${task.status === 'postponed' && 'px-3 py-2 bg-red-200 text-red-500 rounded-md'}
                        `}
                    >
                        {task.status === 'pending' && (
                            <>
                                <FontAwesomeIcon className='me-2' icon={faSpinner} spin />
                                <span>Work on it Now</span>
                            </>
                        )}

                        {task.status === 'in progress' && (
                            <>
                                <FontAwesomeIcon className='me-2' icon={faCheck} />
                                <span>Mark as Done</span>
                            </>
                        )}

                        {task.status === 'completed' && (
                            <>
                                <FontAwesomeIcon className='me-2' icon={faCheckCircle} />
                                <span>This task has been completed</span>
                            </>
                        )}

                        {task.status === 'postponed' && (
                            <>
                                <FontAwesomeIcon className='me-2' icon={faClock} />
                                <span>Task Postponed</span>
                            </>
                        )}
                    </button>

                </div>
            </div>

            <div className='md:w-[45%] w-full'>
                <h2 className="text-gray-600 font-bold underline underline-offset-2 mb-2 mt-10">Tasks Notes</h2>
                <span onClick={HandelAdd} className="w-10 h-10 rounded-full ms-auto mb-3 flex justify-center items-center text-gray-700 bg-amber-200 hover:opacity-65 transition-all duration-500 ease-in-out">
                    <FontAwesomeIcon className="text-2xl text-amber-600" icon={faAdd} />
                </span>
                {notes?.length > 0 ? (
                    notes.map((note: any) => (

                        <div
                            key={note._id}
                            className="w-full group rounded-md px-4 py-3 mb-4 shadow-md bg-white relative overflow-hidden"
                        >
                            <div className="bg-myPrimary/80 z-10 absolute top-0 left-0 w-full h-full 
                                    transform -translate-y-full group-hover:translate-y-0 
                                    transition-all duration-500 ease-in-out 
                                    rounded-md flex justify-center items-center overflow-visible">
                                <FontAwesomeIcon
                                    className="text-mySecondary font-extrabold text-4xl cursor-pointer"
                                    icon={faEye}
                                    onClick={() => handleGet(note)}
                                />
                            </div>
                            <h3 className="text-xl font-bold font-winky-rough text-myPrimary">{note.content}</h3>
                            <span className='text-gray-600 text-xs font-bold underline underline-offset-2'>By: {note.author.name} — {timeAgo(note.createdAt)}</span>
                        </div>
                    ))
                ) : (
                    <Handel txt='Notes' />
                )}
            </div>

        </>
    )
}
