import request from '@/utils/request'

export default {
  getUserList(searchModel) {
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        username: searchModel.username,
        phone: searchModel.phone
      }
    })
  },
  addUser(user) {
    return request({
      url: '/user/adduser',
      method: 'post',
      data: user
    })
  },
  getUserById(id) {
    return request({
      url: '/user/' + id,
      method: 'get',
    })
  },
  updateUser(user) {
    return request({
      url: '/user',
      method: 'put',
      data: user
    })
  },
  deletedUser(id) {
    return request({
      url: '/user/' + id,
      method: 'delete',
    })
  },
}
