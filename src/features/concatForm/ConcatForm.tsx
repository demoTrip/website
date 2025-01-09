import { Form, Input, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import countryData from "../passengerForm/countryFullName.json";
import { forwardRef, useImperativeHandle } from "react";
const { Option } = Select;

export const ConcatForm = forwardRef(
  (props: { onConcatFormFinish: Function }, ref: any) => {
    const { t, i18n } = useTranslation();

    const { onConcatFormFinish } = props;

    const [form] = Form.useForm();
    // 暴露form的submit
    useImperativeHandle(ref, () => ({
      submit: form.submit,
      getFieldValue: form.getFieldValue,
    }));

    const onFinish = (values: any) => {
      onConcatFormFinish(values);
    };

    return (
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        className="passenger-form"
        form={form}
      >
        <div className="ant-space">
          <Form.Item
            name="contactName"
            rules={[
              { required: true, message: t("Please input your concat name!") },
            ]}
          >
            <Input
              bordered={false}
              suffix={<UserOutlined className="site-form-item-icon" />}
              placeholder={t("Concat Name")}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("Please input your email!") },
              { type: "email" },
            ]}
          >
            <Input
              bordered={false}
              suffix={<UserOutlined className="site-form-item-icon" />}
              placeholder={t("Email")}
            />
          </Form.Item>
          <Form.Item
            name="phoneArea"
            rules={[
              { required: true, message: t("Please select your phone area!") },
            ]}
          >
            <Select
              bordered={false}
              placeholder={t("Phone Area")}
              showSearch
              filterOption={(input, option) => {
                return (
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase()) ||
                  (option?.value as string).includes(input)
                );
              }}
            >
              {countryData.map((country) => {
                return (
                  <Option value={country.phoneCode} key={country.code}>
                    {country.phoneCode +
                      " (" +
                      country.name[i18n.language] +
                      ")"}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="mobilePhone"
            rules={[
              {
                required: true,
                message: t("Please input your phone number!"),
                pattern: new RegExp(/^[0-9]+$/),
              },
            ]}
          >
            <Input
              bordered={false}
              suffix={<UserOutlined className="site-form-item-icon" />}
              placeholder={t("Phone Number")}
            />
          </Form.Item>
          {/* <Form.Item
        name="contactTel"
        rules={[{ required: true, message: t("Please input your contactTel!"), pattern: new RegExp(/^[0-9]+$/) }]}
      >
        <Input bordered={false} type="tel"
          suffix={<UserOutlined className="site-form-item-icon" />}
          placeholder={t("contactTel")} />
      </Form.Item> */}
        </div>
      </Form>
    );
  }
);
