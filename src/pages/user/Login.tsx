import ProForm, { ProFormText, ProFormCaptcha } from "@ant-design/pro-form";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-layout";
import { onLoginWithReload } from "./../../userCookie";
import { message, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IUserInfo, ELoginType, EActionType } from "./Interface";
import useFetch from "use-http";

type LoginType = ELoginType.email | ELoginType.account;
const { Text } = Typography;

// const iconStyles: CSSProperties = {
//   marginLeft: '16px',
//   color: 'rgba(0, 0, 0, 0.2)',
//   fontSize: '24px',
//   verticalAlign: 'middle',
//   cursor: 'pointer',
// };

export function LoginPage(props: {
  handleUserPageType: (pageType: EActionType) => void;
}) {
  const { t } = useTranslation();
  const { post, response } = useFetch();

  async function loginRequest(userInfo: IUserInfo) {
    await post("/website/login", {
      email: userInfo.userEmail,
      password: userInfo.userPassword,
    });
    const {
      ok,
      data: { status, data },
    } = response;
    if (ok) {
      if (status) {
        message.success(t("Successfully logined"));
        setTimeout(() => {
          onLoginWithReload({
            email: data.email,
            userName: data.userName,
            valid: data.valid,
          });
        });
      } else {
        message.warn(t("Password wrong"));
      }
    }
  }

  const [loginType] = useState<LoginType>(ELoginType.account);
  return (
    <div style={{ backgroundColor: "white" }}>
      <PageContainer title={t("Sign In")} content={t("manageAndbenefits")}>
        <ProForm
          submitter={{
            // 配置按钮文本
            searchConfig: {
              submitText: t("Sign In"),
            },
            submitButtonProps: {
              style: {
                width: 400,
                fontSize: 24,
                height: 50,
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
            loginRequest(userInfo as IUserInfo);
          }}
        >
          {/* <Tabs
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={ELoginType.account} tab={t("Password")} />
            <Tabs.TabPane key={ELoginType.email} tab={t("Identifying Code ")} />
          </Tabs> */}
          {loginType === ELoginType.account && (
            <>
              <ProFormText
                name="userEmail"
                fieldProps={{
                  size: "large",
                }}
                placeholder={t("Please enter Email")}
                rules={[
                  {
                    required: true,
                    message: t("Please input your user name!"),
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: "large",
                }}
                placeholder={t("Password")}
                rules={[
                  {
                    required: true,
                    message: t("Please input your password!"),
                  },
                ]}
              />
            </>
          )}
          {loginType === ELoginType.email && (
            <>
              <Text>{t("Email")}</Text>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: <MailOutlined className={"prefixIcon"} />,
                }}
                name="userEmail"
                placeholder={t("emailLogin")}
                rules={[
                  {
                    required: true,
                    message: t("请输入邮箱！"),
                  },
                  {
                    pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/,
                    message: t("邮箱格式错误！"),
                  },
                ]}
              />
              <Text>{t("Identify Code")}</Text>
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                captchaProps={{
                  size: "large",
                }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${t("Get Identify Code")}`;
                  }
                  // 验证码服务
                  return "Get Identify Code";
                }}
                name="identifyCode"
                rules={[
                  {
                    required: true,
                    message: "请输入验证码！",
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success("获取验证码成功！验证码为：1234");
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
              height: 20,
            }}
          >
            {/* <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox> */}

            <a
              style={{
                float: "right",
                marginBottom: 10,
              }}
              onClick={() => {
                props.handleUserPageType(EActionType.forget);
              }}
            >
              {t("Forgot Password")}
            </a>
            <div style={{ float: "left" }}>
              {t("Do not have account yet ?")}
            </div>
            <a
              style={{
                float: "left",
                marginBottom: 10,
              }}
              onClick={() => {
                props.handleUserPageType(EActionType.register);
              }}
            >
              {t("Regist Now")}
            </a>
          </div>
        </ProForm>
        <div
          style={{ marginTop: 50, fontSize: 10, color: "gray", marginLeft: 10 }}
        >
          {t("loginStatement")}
        </div>
      </PageContainer>
    </div>
  );
}
