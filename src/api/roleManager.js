import request from '@/utils/request'

export default {
  getRoleList(searchModel) {
    return request({
      url: '/role/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        roleName: searchModel.roleName,
      }
    })
  },
  saveRole(role) {
    return request({
      url: '/role/addrole',
      method: 'post',
      data: role
    })
  },
  getRoleById(id) {
    return request({
      url: '/role/' + id,
      method: 'get',
    })
  },
  updateRole(role) {
    return request({
      url: '/role',
      method: 'put',
      data: role
    })
  },
  deletedRole(id) {
    return request({
      url: '/role/' + id,
      method: 'delete',
    })
  },
  getAllRole() {
    return request({
      url: '/role/all',
      method: 'get',
    })
  },
}
