import { onLoginWithReload, logout } from './../../userCookie';
import { IUserInfo, EActionType } from './Interface';
import { message } from 'antd';

export const onSubmit = async (actionType: EActionType, userInfo: IUserInfo) => {
    switch (actionType) {
        case EActionType.login:
            loginRequest(userInfo);
            break;
        case EActionType.register:
            break;
        case EActionType.forget:
            break;
    }
    //服务
    console.log(userInfo);
}

async function loginRequest(userInfo: IUserInfo) {
    message.success('登陆成功');
    setTimeout(
        () => onLoginWithReload({
            email: userInfo.userEmail,
            userName: userInfo.userName,
            valid: false
        }), 3000
    )
    
}

export function loginOut() {
    logout();
}

export function setUserInfo() {
    
}