import {axios} from '../utils/request'
import {USER_MODULE} from './_prefix'

type LoginInfo = {
    email: string,
    password: string
}

type RegisterInfo = {
    name: string,
    email: string,
    password: string,
}
type tokenInfo = {
    token: string,
}


// 如果有“Vue: This may be converted to an async function”警告，可以不管
// 用户登录
export const userLogin = (loginInfo: LoginInfo) => {
    return axios.post(`${USER_MODULE}/login`, loginInfo, {
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        console.log(res.data)
        return res
    })
}

// 用户注册
export const userRegister = (registerInfo: RegisterInfo) => {
    return axios.post(`${USER_MODULE}/register`, registerInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

//改换用户权限
export const userUpdate = (tokenInfo:tokenInfo) => {
    return axios.post(`${USER_MODULE}/update`,tokenInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
