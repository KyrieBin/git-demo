// 封装当前时间方法

const getTime = () => {
    let hour = new Date().getHours();
    if (hour >= 6 && hour <= 8) {
        return '早上'
    } else if (hour > 8 && hour <= 12) {
        return '上午'
    } else if (hour > 12 && hour <= 18) {
        return '下午好'
    } else {
        return '晚上好'
    }
}
export default getTime