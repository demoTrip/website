import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { useTranslation } from "react-i18next";
import { Button, message } from "antd";
import { IUserInfo } from "./Interface";
import { Form, Input } from "antd";
import { getURLParameters } from "@common/utils";

export const ResetPWDPage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { post, response } = useFetch();
  const param = getURLParameters(location.search);
  async function changeRequset(userInfo: IUserInfo) {
    if (userInfo.reUserPassword !== userInfo.userPassword) {
      message.error(t("The passwords entered twice are inconsistent"));
      return;
    }
    await post("/website/resetpwd", {
      userGuid: param.userid,
      newPwd: userInfo.userPassword,
    });
    if (response.ok) {
      if (!response.data.status) {
        message.error(response.data.msg);
      } else {
        message.success(
          response.data.msg || t("Password Changed Successfully")
        );
        navigate("/");
      }
    } else {
      message.error("Network Error");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={async (userInfo) => {
          changeRequset(userInfo as any);
        }}
        autoComplete="off"
      >
        <Form.Item
          label={t("New Password")}
          name="userPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={t("Re enter the password")}
          name="reUserPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {t("UpdatePWD")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPWDPage;
