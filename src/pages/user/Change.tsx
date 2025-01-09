import ProForm, {
  ProFormText
} from "@ant-design/pro-form";
import {
  LockOutlined
} from "@ant-design/icons";
import { loginUser } from "src/userCookie";

import { message} from "antd";
import { BasicLayout, FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IUserInfo, ELoginType, EActionType } from "./Interface";
import { onSubmit } from "./LoginFuncs";
import useFetch from "use-http";
import { loginOut } from "@pages/user/LoginFuncs";

export function ChangePage(props: {
  handleUserPageType: (pageType: EActionType) => void;
}) {
  const { t } = useTranslation();
  const { post, response } = useFetch();

  async function changeRequset(userInfo: IUserInfo) {
    if (userInfo.reUserPassword !== userInfo.userPassword) {
      message.error(t('The passwords entered twice are inconsistent'));
      return;
    }
    await post("/website/updatepwd", { email: loginUser().email, newPwd: userInfo.userPassword, oldPwd: userInfo.curUserPassword });
    if (response.ok) {
      if (!response.data.status) {
        message.error(response.data.msg);
      } else {
        message.success(response.data.msg || t('Password Changed Successfully'));
        setTimeout(()=> {
          loginOut();
        })
      }
    } else {
      message.error("Network Error");
    }
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <PageContainer title={t('Change password')}>
        <ProForm
          title={t('Change password')}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              submitText: t('UpdatePWD'),
            },
            submitButtonProps: {
              style: {
                marginLeft: -10,
                width: 100,
              },
            },
            // 配置按钮的属性
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                display: "none",
              },
            },
          }}
          onFinish={async (userInfo) => {
            changeRequset(userInfo as any);
          }}
        >
          <ProFormText.Password
            name="curUserPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={t("Current password")}
            rules={[
              {
                required: true,
                message: "",
              }
            ]}
          />
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={t("New Password")}
            rules={[
              {
                required: true,
                message: "",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: t('The password must consist of more than 8 English letters and numbers'),
              }
            ]}
          />
          <ProFormText.Password
            name="reUserPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={t("Re enter the password")}
            rules={[
              {
                required: true,
                message: "",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: t('The password must consist of more than 8 English letters and numbers'),
              }
            ]}
          />

          {/* <Text>验证码</Text>
          <ProFormCaptcha
            fieldProps={{
              size: "large",
              prefix: <SendOutlined className={"prefixIcon"} />,
            }}
            captchaProps={{
              size: "large",
            }}
            placeholder={"请输入验证码"}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${"获取验证码"}`;
              }
              // 验证码服务
              return "获取验证码";
            }}
            name="identifyCode"
            rules={[
              {
                required: true,
                message: "请输入验证码！",
              },
            ]}
            onGetCaptcha={async () => {
              message.success("获取验证码成功！");
            }}
          />
          <Text>新密码</Text>
          <ProFormText
            name="userPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"请输入新密码"}
            rules={[
              {
                required: true,
                message: "请输入新密码！",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: "密码长度至少为8，至少含有一个字母和一个数字",
              },
            ]}
          /> */}
        </ProForm>
      </PageContainer>
    </div>
  );
}
