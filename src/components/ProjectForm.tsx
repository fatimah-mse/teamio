interface Tproject {
    type: 'add' | 'edit'
    initialData?: {
        name: string
        description: string
        startDate: string
        endDate: string
    }
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function ProjectForm({ initialData = {
    name: '',
    description: '',
    startDate: '',
    endDate: ''
}, type, handleSubmit }: Tproject) {

    return (
        <form method="post" className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="name">Project Name :</label>
            <input defaultValue={initialData.name} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" type="text" name="name" id="name" placeholder="project name" />
            <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="description">Project Description :</label>
            <textarea defaultValue={initialData.description} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" name="description" id="description" placeholder="project description" />
            <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="startDate">{`${type === 'add' ? '' : 'Change'} Project Start Date :`}</label>
            <input defaultValue={initialData.startDate} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" type="date" name="startDate" id="startDate" />
            <label className='text-gray-600 font-bold underline underline-offset-2' htmlFor="endDate">{`${type === 'add' ? '' : 'Change'} Project End Date :`}</label>
            <input defaultValue={initialData.endDate} className="border mb-4 border-myPrimary focus:outline-none px-4 py-2 rounded-md w-3/5 max-768:w-full" type="date" name="endDate" id="endDate" />
            <input className="px-6 py-3 block w-max mt-5 font-semibold text-mybg bg-myPrimary rounded-md hover:opacity-75 transition-all duration-500 ease-in-out cursor-pointer" type="submit" value={`${type === 'add' ? 'Add' : 'Edit'} Project`} />
        </form>
    )
}
