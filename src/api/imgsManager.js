import request from '@/utils/request'

export default {
  getImagsList(pageNo,orderBy) {
    return request({
      url: '/imgs/all',
      method: 'get',
      params: {
        pageNo: pageNo,
        orderBy : orderBy
      }
    })
  },
}
