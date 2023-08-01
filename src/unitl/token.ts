export const getToken = () => {
    return localStorage.getItem('token');
}

export const setToken = (data: string) => {
    return localStorage.setItem('token', data);
}

export const RemoveToken = () => {
    return localStorage.removeItem('token');
}