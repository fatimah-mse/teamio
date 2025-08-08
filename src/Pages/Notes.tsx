import { useEffect, useState } from 'react'
import Description from '../components/Description'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loader from '../components/Loader'
import Handel from '../components/Handel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { timeAgo } from '../helpers/helpers'

type TNote = {
    _id: string
    task: {
        _id: string
        title: string
    }
    author: {
        _id: string
        name: string
    }
    content: string
    createdAt: string
}

export default function Notes() {

    const [sort, setSort] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [notes, setNotes] = useState<Array<TNote>>([])
    const role = localStorage.getItem('role')

    const fetchNotes = async (sortOrder: string) => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const params: any = {}
            if (sortOrder) params.sort = sortOrder

            const response = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/notes', {
                headers: { Authorization: `Bearer ${token}` },
                params
            })

            setNotes(response.data.data)
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message,
                icon: "error",
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3754DB'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes(sort)
    }, [sort])

    if (loading) return <Loader />

    return (
        <div>
            <Description
                title="Notes"
                text={
                    role === 'admin'
                        ? `As an admin, you can view all notes across every task and add new notes to provide guidance or feedback.
                            Note that only the creator of a note can edit or delete it, ensuring secure and responsible note management.`
                        :
                        `You can view notes related to the tasks assigned to you.
                        You can add notes as needed, and only you (the note creator) can edit or delete your own notes.`
                }
            />
            <p className="text-myPrimary font-winky-rough font-semibold text-xl capitalize my-4">You can filter tasks based on the following field :</p>
            <select
                className="border border-myPrimary shadow-md font-winky-rough focus:outline-none text-myPrimary px-3 py-2 rounded-md w-[22%] max-768:w-full"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <option className="text-sm font-winky-rough font-medium" value="">Order By</option>
                <option className="text-sm font-winky-rough font-medium" value="asc">ASC</option>
                <option className="text-sm font-winky-rough font-medium" value="desc">DESC</option>
            </select>

            {!notes ? <Handel txt='Notes' />
                :
                (
                    <div className={`relative flex flex-wrap gap-3 gap-y-5 justify-between mt-5 ${show ? 'h-max' : 'h-64'} overflow-hidden pb-16`}>
                        {notes.map((note, index) => {
                            return (
                                <div key={index} className='w-[48%] max-768:!w-full bg-white px-5 py-8 rounded-md shadow-lg shadow-myPrimary/30 relative'>
                                    <Link className='absolute right-2 top-2 px-2 py-1 rounded-md bg-amber-200' to={`/dashboard/show-task/${note.task._id}`}>
                                        <FontAwesomeIcon className='-rotate-45 text-xl text-amber-600' icon={faArrowRight} />
                                    </Link>
                                    <h3 className='text-myPrimary font-winky-rough text-xl font-semibold mb-3'>Task : {note.task.title}</h3>
                                    <p className='text-gray-800 capitalize font-semibold mb-8'>Note : {note.content}</p>
                                    <span className='block text-right text-amber-500 text-xs font-extrabold underline underline-offset-2'>{note.author.name} — {timeAgo(note.createdAt)}</span>
                                </div>
                            )
                        })
                        }
                        <div className={`${show ? 'hidden' : 'absolute'} bottom-0 left-0 w-full h-16 bg-gradient-to-t from-mybg to-transparent pointer-events-none`}></div>

                        <button
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 px-8 py-2 bg-myPrimary text-mybg rounded-md"
                            onClick={() => setShow(!show)}
                        >
                            {show ? 'Show Less' : 'Load All'}
                        </button>
                    </div>
                )
            }
        </div>
    )
}
