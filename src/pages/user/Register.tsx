import ProForm, { ProFormText } from "@ant-design/pro-form";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { message } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useTranslation } from "react-i18next";
import { IUserInfo, EActionType } from "./Interface";
import useFetch from "use-http";
import { onLoginWithReload } from "src/userCookie";

export function RegisterPage(props: {
  handleUserPageType: (pageType: EActionType) => void;
}) {
  const { t } = useTranslation();
  const { post, response } = useFetch();

  async function registRequset(userInfo: IUserInfo) {
    // if (userInfo.reUserPassword !== userInfo.userPassword) {
    //   message.error(t('The passwords entered twice are inconsistent'));
    //   return;
    // }
    await post("/website/register", {
      userName: userInfo.userName,
      email: userInfo.userEmail,
      password: userInfo.userPassword,
      birthday: "",
      phone: "",
      displayName: userInfo.userName,
    });
    if (response.ok) {
      if (response.data.status) {
        message.success(t("An activation email has been sent to the mailbox!"));
        setTimeout(() => {
          onLoginWithReload({
            email: userInfo.userEmail,
            userName: userInfo.userName,
            valid: false,
          });
        }, 1000);
      } else {
        message.error(response.data.msg || t("Network Error"));
      }
    } else {
      message.error(response.data.msg || t("Network Error"));
    }
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <PageContainer title={t("Register")}>
        <ProForm
          submitter={{
            // 配置按钮文本
            searchConfig: {
              submitText: t("Register"),
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
            registRequset(userInfo as IUserInfo);
          }}
        >
          <ProFormText
            name="userName"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
            }}
            placeholder={t("Please input your user name!")}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          />
          <ProFormText
            fieldProps={{
              size: "large",
              prefix: <MailOutlined className={"prefixIcon"} />,
            }}
            name="userEmail"
            placeholder={t("Please input your email!")}
            rules={[
              {
                required: true,
                message: t(""),
              },
              {
                pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/,
                message: t(""),
              },
            ]}
          />
          {/* <ProFormCaptcha
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
          /> */}
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={t("Please input your password!")}
            rules={[
              {
                required: true,
                message: "",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: t(
                  "The password must consist of more than 8 English letters and numbers"
                ),
              },
            ]}
          />
          {/* <ProFormText.Password
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
          <div style={{ marginBottom: 10 }}>
            <a
              onClick={() => {
                props.handleUserPageType(EActionType.login);
              }}
            >
              {t("Already a demoTrip.com member ? Sign In >")}
            </a>
          </div>
        </ProForm>
        <div
          style={{ marginTop: 50, fontSize: 10, color: "gray", marginLeft: 10 }}
        >
          {t("loginStatement")}
        </div>
      </PageContainer>
      {/* <Text onClick={}></Text> */}
    </div>
  );
}
