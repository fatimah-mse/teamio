import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong, faClose, faMessage } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

type Message = {
    _id?: string
    userId?: string
    username: string
    text: string
}

const Chat = () => {
    const [username] = useState(localStorage.getItem('username') || 'Guest')
    const [message, setMessage] = useState('')
    const [show, setShow] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    const showRef = useRef(show)
    const chatRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<Socket | null>(null)

    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }

    useEffect(() => {
        showRef.current = show
    }, [show])

    useEffect(() => {
        scrollToBottom()
    }, [messages])


    useEffect(() => {
        async function fetchMessages() {
            try {
                const res = await axios.get('https://task-manager-apis-t2dp.onrender.com/api/messages', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setMessages(res.data.data.slice().reverse())
            } catch (err) {
                console.error("Error fetching messages", err)
            }
        }

        fetchMessages()

        socketRef.current = io('https://task-manager-apis-t2dp.onrender.com')

        socketRef.current.on('new-msg', (data: Message) => {
            setMessages(prev => [...prev, data])
        })

        return () => {
            socketRef.current?.disconnect()
        }

    }, [])

    const handleSendMessage = () => {
        if (message.trim() && socketRef.current) {
            socketRef.current.emit('chat-msg', {
                username,
                msg: message,
                token: localStorage.getItem('token')
            })

            setMessage('')
        }
    }

    return (
        <section className="fixed max-576:!bottom-3 bottom-6 right-4 md:!right-8 overflow-hidden z-30">
            <span
                onClick={() => {
                    setShow(!show),
                        scrollToBottom()
                }}
                className="w-12 h-12 mt-2 bg-amber-400 rounded-full flex justify-center items-center cursor-pointer"
            >
                <FontAwesomeIcon className="text-2xl text-amber-100" icon={faMessage} />
            </span>
            <div
                className={`flex flex-col h-[440px] bg-white rounded-md shadow-2xl shadow-myPrimary/40 w-full max-576:max-w-[80%] max-w-96 transition-all duration-700 ease-in-out fixed bottom-20 z-30 ${show ? 'right-4 md:!right-8' : '-right-full'
                    }`}
            >
                <div className="px-3 py-2 bg-blue-100 shadow-md flex justify-between items-center rounded-t-md overflow-hidden">
                    <span className="font-semibold capitalize text-gray-500">
                        Chat
                    </span>
                    <FontAwesomeIcon
                        className="text-xl text-gray-600 cursor-pointer"
                        onClick={() => setShow(false)}
                        icon={faClose}
                    />
                </div>
                <div ref={chatRef} className="chat flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => {
                            const isOwnMessage = msg.username === username
                            return (
                                <motion.div
                                    key={msg._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex flex-col ${isOwnMessage ? 'self-end items-end' : 'self-start items-start'} max-w-[75%]`}
                                >
                                    {!isOwnMessage && (
                                        <span className="text-xs text-gray-600 font-bold mb-1 capitalize">{msg.username}</span>
                                    )}
                                    <p
                                        className={`px-4 py-2 text-sm font-semibold rounded-2xl shadow-md ${isOwnMessage
                                            ? 'bg-gradient-to-br from-blue-500 to-myPrimary text-mybg rounded-s-full'
                                            : 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-gray-700 rounded-e-full'
                                            }`}
                                    >
                                        {msg.text}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
                <div className="flex items-center border-t px-4 py-3 gap-2">
                    <input
                        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="write a message ..."
                    />
                    <button
                        className="bg-gradient-to-r from-blue-400 to-myPrimary text-mybg w-10 h-10 rounded-full text-sm"
                        onClick={handleSendMessage}
                    >
                        <FontAwesomeIcon className="font-extrabold text-lg" icon={faArrowRightLong} />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Chat