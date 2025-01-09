import cookie from "react-cookies";

export interface IUserInfo {
  email: string;
  userName: string;
  valid: boolean;
}

// 获取当前用户cookie
export const loginUser = (): IUserInfo => {
  return cookie.load("userInfo") || {};
};

// 用户登录，保存cookie
export const onLoginWithReload = (user: IUserInfo) => {
  onLogin(user)
  window.location.reload();
};

// 用户登录，保存cookie(不刷新)
export const onLogin = (user: IUserInfo) => {
  cookie.save("userInfo", user, { path: "/" });
};

// 用户登出，删除cookie
export const logout = () => {
  cookie.remove("userInfo");
  window.location.href = "/";
};
