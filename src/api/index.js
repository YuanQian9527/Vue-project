//将组件api统一导出
import *as trademark from './product/tradeMark'
import *as attr from './product/attr'
import *as spu from './product/spu'
import *as sku from './product/sku'

//引入权限管理的api文件
import * as user from './acl/user';
import role from './acl/role';
import permission from './acl/permission'
export default{
    trademark,
    attr,
    spu,
    sku,
    user,
    role,
    permission
}