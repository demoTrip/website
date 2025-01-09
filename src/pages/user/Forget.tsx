import ProForm, {
  ProFormText
} from "@ant-design/pro-form";
import {
  UserOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { BasicLayout, FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { IUserInfo, ELoginType, EActionType } from "./Interface";
import { onSubmit } from "./LoginFuncs";
import useFetch from "use-http";

export function ForgetPage(props: {
  handleUserPageType: (pageType: EActionType) => void;
  isForget?: boolean;
}) {
  const { isForget } = props;
  const { t } = useTranslation();
  const { post, response } = useFetch();

  async function forgetRequset(userInfo: IUserInfo) {
    if (userInfo.reUserPassword !== userInfo.userPassword) {
      message.error(t('The passwords entered twice are inconsistent'));
      return;
    }
    await post("/website/forgot", { 
      email: userInfo.userEmail,
    });
    if (response.ok) {
      if (!response.data.status) {
        message.error(response.data.msg);
      } else {
        message.success(response.data.msg + t('An activation email has been sent to the mailbox!'));
        setTimeout(() => {
          window.location.href = "/";
        }, 1000)
      }
    } else {
      message.error(t("Network Error"));
    }
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <PageContainer
        title={isForget ? t("Forgot Password") : t("Set Password")}
        content={isForget ? t("forgetContent") : t("setPwdContent")}
      >
        <ProForm
          title={isForget ? t("Forgot Password") : t("Set Password")}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              submitText: t('Send'),
            },
            submitButtonProps: {
              style: {
                width: 400,
                fontSize: 24,
                height: 50
              }
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
            forgetRequset(userInfo as IUserInfo);
          }}
        >
              <ProFormText
                name="userEmail"
                fieldProps={{
                  size: "large"
                }}
                placeholder={t("Please input your user name!")}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              />
          
          {/* <ProFormText.Password
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
          /> */}
          {/* <div style = {{ marginBottom: 10 }}>
            <a
              onClick={() => {
                props.handleUserPageType(EActionType.login);
              }}
            >
              {t('Sign in')}
            </a>
        </div> */}
            
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
