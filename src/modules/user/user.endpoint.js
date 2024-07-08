import { roles } from "../../middleware/auth.middleware.js"; 


export const endPoint = {
    getPostsOfOwner:[roles.Organization,roles.User, roles.Admin],
    me: [roles.Organization,roles.User, roles.Admin],
    getUser : [roles.Organization,roles.User, roles.Admin],
    updateUser :[roles.Organization,roles.User, roles.Admin],
    deleteUser : [roles.Admin],
    getMyFollowings:[roles.User,roles.Organization],
    getUserFollowings:[roles.User,roles.Organization,roles.Admin],
    getMyFollowers:[roles.User,roles.Organization],
    getUserFollowers:[roles.User,roles.Organization,roles.Admin],
    makeFollow:[roles.User,roles.Organization],
    changeStatus:[roles.Admin]
}