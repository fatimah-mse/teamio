export function timeAgo(dateString: string) {
    const now = new Date()
    const date = new Date(dateString)
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return `${diff} second ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} minute ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour ago`
    return `${Math.floor(diff / 86400)} day ago`
}