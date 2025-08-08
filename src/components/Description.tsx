interface Tdesc {
    title: string
    text: string
}

export default function Description({ title, text }: Tdesc) {
    return (
        <div className="p-4 bg-white mb-5 rounded-md shadow-lg relative">
            <span className="block font-winky-rough text-myPrimary text-2xl font-semibold capitalize pb-2 mb-2 border-b border-gray-400">
                Welcome to your  {title}  Overview . . .
            </span>
            <p className="text-gray-700 font-semibold leading-6 max-576:text-sm">
                {text}
            </p>
        </div>
    )
}
