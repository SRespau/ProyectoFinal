//Definimos todas las rutas API
export const host = "http://localhost:5000";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const getUserRoute = `${host}/api/auth/getUser`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const userEditRoute = `${host}/api/auth/userEdit`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessagesRoute = `${host}/api/messages/getmsg`;
export const createCommunity = `${host}/api/communities/createCommunity`;
export const allCommunities = `${host}/api/communities/allCommunities`;
export const joinCommunity = `${host}/api/communities/joinCommunity`;
export const allCommunityMsg = `${host}/api/communities/getCommunityMsg`;
export const sendCommunityMsg = `${host}/api/communities/sendCommunityMsg`;
export const deleteOneCommunity = `${host}/api/communities/deleteCommunity`;

