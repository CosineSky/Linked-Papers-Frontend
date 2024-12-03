import {ElLoading} from "element-plus";

export function fullScreenLoading(millisecond: any) {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
        loading.close()
    }, millisecond * (1 + 0.2 * Math.random()))
}