import { faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'
import "swiper/swiper-bundle.css"
import { Link } from 'react-router-dom'

interface arrayData {
    _id?: string
    name?: string
    title?: string
    status?: string
    description?: string
    totalTasks?: number
    completedTasks?: number
    dueDate?: string
    project?: {
        name: string
    }
}

interface Tslider {
    data: arrayData[]
    rout: string
    task?: boolean
}

export default function Slider({ data, rout, task }: Tslider) {

    return (
        <Swiper
            modules={[Pagination, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            coverflowEffect={{
                rotate: data.length >= 2 ? 50 : 0,
                stretch: 0,
                depth: data.length >= 2 ? 100 : 0,
                modifier: 1,
                slideShadows: false
            }}
            breakpoints={{
                1200: { slidesPerView: 3 },
                768: { slidesPerView: 2 },
                576: { slidesPerView: 1 }
            }}
            pagination={{ clickable: true }}
            className="w-full mySwiper flex flex-col items-center gap-6 [&_.swiper-wrapper]:!my-10"
        >
            {data.map((p) => {
                const progress =
                    p.totalTasks && p.totalTasks > 0
                        ? Math.round((p.completedTasks! / p.totalTasks) * 100)
                        : 0

                return (
                    <SwiperSlide
                        key={p._id}
                        className="flex !h-auto justify-stretch items-center"
                    >
                        <div className="group shadow-lg bg-white py-16 relative px-4 mb-5 rounded-md text-center w-full h-full overflow-hidden">
                            {task && (
                                <span className={`
                                    font-extrabold text-sm px-1.5 py-1 rounded-md absolute top-3 right-3
                                    ${p.status === 'pending' && 'text-mySecondary bg-yellow-100'}
                                    ${p.status === 'in progress' && 'text-myPrimary bg-blue-100'}
                                    ${p.status === 'completed' && 'text-green-500 bg-green-100'}
                                    ${p.status === 'postponed' && '!text-red-500 bg-red-100'}
                                `}>
                                    {p.status}
                                </span>
                            )}

                            <div className="bg-myPrimary/80 z-10 absolute top-0 left-0 w-full h-full 
                                transform -translate-y-full group-hover:translate-y-0 
                                transition-all duration-500 ease-in-out 
                                rounded-md flex justify-center items-center overflow-visible">
                                <Link to={`/dashboard/${rout}${p._id}`}>
                                    <FontAwesomeIcon
                                        className="text-mySecondary font-extrabold text-4xl cursor-pointer"
                                        icon={faEye}
                                    />
                                </Link>
                            </div>

                            <h1 className="text-myPrimary text-xl font-bold mb-5">{task ? p.title : p.name}</h1>
                            <p className="text-gray-600 text-sm">{p.description}</p>

                            {task && (
                                <span className={`
                                    text-amber-500 font-semibold text-sm italic mt-10 block underline underline-offset-2`}>
                                    project: {p.project?.name}
                                </span>
                            )}

                            {!task && p.totalTasks !== undefined && (
                                <div className="w-full mt-6 px-6">
                                    <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
                                        <span>Completed</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <span
                                            className="block bg-mySecondary h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                            style={{ width: `${progress}%` }}
                                        ></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}

