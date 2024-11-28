//将身份转化为中文显示
export function parseRole(role: string | null) {
    if (role === 'user') {
        return "请升级"
    } else if (role === 'VIP') {
        return "VIP用户"
    }
}
