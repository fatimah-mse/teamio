import { useEffect, useRef } from "react"
import audioFile from '../assets/sounds/notification.mp3'
import { io, Socket } from 'socket.io-client'

export default function Notification() {

    const socketRef = useRef<Socket | null>(null)
    const notifSoundRef = useRef<HTMLAudioElement>(null)
    const notificationBoxRef = useRef<HTMLDivElement>(null)
    const notificationMessageRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        socketRef.current = io('https://task-manager-apis-t2dp.onrender.com')

        socketRef.current.on('connect', () => {
            console.log('Socket connected:', socketRef.current?.id)

            const userId = localStorage.getItem('userId')
            if (userId) {
                socketRef.current?.emit('register-user', userId)
                console.log('register-user sent:', userId)
            }
        })

        socketRef.current.on('notification', (msg: string) => {
            if (notificationBoxRef.current && notificationMessageRef.current) {
                notificationMessageRef.current.innerText = msg
                console.log("Notification received in frontend:", msg)
                notificationBoxRef.current.style.transform = 'translateX(0)'
                notifSoundRef.current?.play()

                setTimeout(() => {
                    if (notificationBoxRef.current) {
                        notificationBoxRef.current.style.transform = 'translateX(200%)'
                    }
                }, 4000)
            }
        })

        return () => {
            socketRef.current?.disconnect()
        }
    }, [])



    return (
        <>
            <audio ref={notifSoundRef} src={audioFile} preload="auto"></audio>
            <div
                ref={notificationBoxRef}
                className="fixed z-50 top-6 max-768:top-8 right-6 max-768:right-4 bg-blue-200 px-4 py-2 rounded-md transition-transform duration-500 translate-x-[200%] shadow-lg"
            >
                <span ref={notificationMessageRef} className="text-gray-800 font-semibold"></span>
            </div>
        </>
    )
}

