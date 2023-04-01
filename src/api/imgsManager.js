import request from '@/utils/request'

export default {
  getImagsList(pageNo) {
    return request({
      url: '/imgs/all',
      method: 'get',
      params: {
        pageNo: pageNo
      }
    })
  },
}
