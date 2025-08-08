import handel from '../assets/imgs/handel.webp'

interface Thandel {
    txt: string
}

export default function Handel({ txt } :Thandel) {
    return (
        <div className="flex flex-col justify-center items-center gap-2 my-6">
            <img className="w-72 max-576:w-full" src={handel} alt="handel-img" />
            <span className="text-gray-800 font-bold italic max-576:text-sm">No {txt} Founded</span>
        </div>
    )
}
