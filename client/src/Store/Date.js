export const getCurrentTime = () => {
    const date = new Date()
    const hours = ("0" + date.getHours()).slice(-2)
    const minutes = ("0" + date.getMinutes()).slice(-2)
    const currentTime = hours + ':' + minutes
    return currentTime
}