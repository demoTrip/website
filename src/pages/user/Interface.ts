// export interface IUserInfo {
//   // 站点，默认为空，待统一填入
//   domain: {
//     type: String;
//     trim: true;
//   };
//   // 用户名
//   id: {
//     type: String;
//     trim: true;
//   };
//   // 用户密码
//   password: {
//     type: String;
//     trim: true;
//   };
//   // 用户昵称，默认为系统生成
//   name: {
//     type: String;
//     trim: true;
//   };
//   // 性别
//   sex: {
//     type: String; // Unknown,male,female
//     trim: true;
//   };
//   // 年龄
//   age: {
//     type: Number; // 用户计算儿童票
//   };
//   // 手机
//   phone: {
//     type: String; // 带区号
//     trim: true;
//   };
//   // 邮箱（必填）
//   email: {
//     type: String;
//     trim: true;
//   };
// }

export interface IUserInfo {
  userEmail: string;
  identifyCode: string;
  userName: string;
  userPassword: string;
  reUserPassword: string;
  curUserPassword: string;
  valid: boolean;
}

export enum ELoginType {
  email = "EMAIL",
  account = "ACCOUNT",
}

export enum EActionType {
  login = "LOGIN",
  register = "RESIGTER",
  forget = "FORGET",
  change = "CHANGE",
  setPwd = "SETPWD",
}
