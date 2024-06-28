import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    getPostsOfOwner:[roles.Organization,roles.User, roles.Admin],
    getHomePagePosts:[roles.Organization,roles.User, roles.Admin],
    createPost : [roles.Organization,roles.User, roles.Admin],
    // findUserChats:[roles.Organization,roles.User],
    updatePost:[roles.Organization,roles.User, roles.Admin],
    findPost:[roles.Organization,roles.User, roles.Admin],
    deletePost:[roles.Organization,roles.User,roles.Admin],
    likePost:[roles.Organization,roles.User,roles.Admin],
    commentPost:[roles.Organization,roles.User,roles.Admin],
    sharePost:[roles.Organization,roles.User,roles.Admin],
    getPostById:[roles.Organization,roles.User,roles.Admin],
    searchPost: [roles.Organization,roles.User,roles.Admin],
}