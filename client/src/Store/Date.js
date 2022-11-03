const date = new Date()

export const getCurrentTime = () => {
    let hours = ("0" + date.getHours()).slice(-2)
    let minutes = ("0" + date.getMinutes()).slice(-2)
    let currentTime = hours + ':' + minutes
    return currentTime
}