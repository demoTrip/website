import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { EPassengerType, TPassenger } from "src/features/searchForm";
import countryData from "./countryFullName.json";
import { useTranslation } from "react-i18next";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import moment from "moment";
import { useCommonHeaderData } from "@common/commonData";
import NameInput from "./NameInput";
const { Title } = Typography;
const { Option } = Select;

export const PassengerForm = forwardRef((props: { time: string|null, type: EPassengerType, defaultValue: TPassenger, onFormFinish: Function, onPassengerChange: Function }, ref: any) => {
  const { t } = useTranslation();
  const ticketName = {
    [EPassengerType.adult]: t("Adult Ticket"),
    [EPassengerType.child]: t("Child Ticket (2-11 years old)"),
    [EPassengerType.infant]: t("Infant Ticket (Under 2 years old)"),
  };

  const { type, defaultValue, onFormFinish, onPassengerChange, time } = props;

  const addPassengerButton: any = useRef(null);

  // 全局顶部数据
  const headData = useCommonHeaderData();

  const [form] = Form.useForm();
  // 暴露form的submit
  useImperativeHandle(ref, () => ({
    submit: form.submit,
  }));

  // 页面首次渲染时触发add按钮增加n行默认表单
  useEffect(() => {
    if(time){
      const defaultDate = moment(time).add(180, 'days')
      form.setFieldsValue({users: Array.from({length: defaultValue.count}).map(()=>({passportLimit: defaultDate}))})
    }
  }, [form, defaultValue.count, time]);

  const disabledDate = (current: any) => {
    if (type === EPassengerType.adult) {
      return current && current >= moment().subtract(11, 'years');
    }
    if (type === EPassengerType.child) {
      return current && (current >= moment().subtract(2, 'years') || current <= moment().subtract(11, 'years'));
    }
    if (type === EPassengerType.infant) {
      return current && (current >= moment().endOf("day") || current <= moment().subtract(2, 'years'));
    }
  };

  const defaultDateValue = useMemo(() => {
    switch (type) {
      case EPassengerType.adult:
        return moment().subtract(30, 'years');
      case EPassengerType.child:
        return moment().subtract(11, 'years');
      case EPassengerType.infant:
        return moment().subtract(2, 'years');
      default:
        return moment().subtract(30, 'years');
    }
  }, [type])

  const onFinish = (values: any) => {
    onFormFinish(type, values)
  };

  return (
    <>
      {defaultValue.count !== 0 &&
        <Form
          className="passenger-form"
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Title className="title" level={5}>
            {ticketName[type]}
          </Title>
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div className="ant-space" key={key}>
                    <div className="top-box">
                      <Title className="title" level={5}>
                        {name + 1}.
                      </Title>
                      {fields.length > 1 && <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => { remove(name); onPassengerChange(type, fields.length - 1); }}
                      >
                        {t("Clear")}
                      </Button>}
                    </div>
                    <Form.Item
                      {...restField}
                      name={[name, "givenName"]}
                      fieldKey={["givenName"]}
                      rules={[
                        { required: true, message: t("Missing First & middle name") },
                      ]}
                    >
                      <NameInput
                        bordered={false}
                        suffix={<UserOutlined className="site-form-item-icon" />}
                        placeholder={t("First & middle name")}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "surName"]}
                      fieldKey={["surName"]}
                      rules={[{ required: true, message: t("Missing Last name") }]}
                    >
                      <NameInput
                        bordered={false}
                        suffix={<UserOutlined className="site-form-item-icon" />}
                        placeholder={t("Last Name")}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "gender"]}
                      fieldKey={["gender"]}
                      rules={[{ required: true, message: t("Missing gender") }]}
                    >
                      <Select bordered={false} placeholder={t("Gender")}>
                        <Option value="female">{t("Female")}</Option>
                        <Option value="male">{t("Male")}</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "birthDay"]}
                      fieldKey={["birthDay"]}
                      rules={[{ required: true, message: t("Missing date of birth") }]}
                    >
                      <DatePicker defaultPickerValue={defaultDateValue} disabledDate={disabledDate} placeholder={t("Date of birth")} bordered={false} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "nationality"]}
                      fieldKey={["nationality"]}
                      rules={[{ required: true, message: t("Missing nationality") }]}
                    >
                      <Select
                        showSearch
                        bordered={false}
                        placeholder={t("Nationality")}
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {countryData.map((country) => {
                          return (
                            <Option value={country.code} key={country.code}>
                              {country.name[headData.locale]}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "cardType"]}
                      fieldKey={["cardType"]}
                    >
                      <Select bordered={false} placeholder={t("Passport Type")}>
                        <Option value="Passport">{t("Passport")}</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "cardNo"]}
                      fieldKey={["cardNo"]}
                    >
                      <Input
                        bordered={false}
                        suffix={<UserOutlined className="site-form-item-icon" />}
                        placeholder={t("Passport Document Number")}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "passportLimit"]}
                      fieldKey={["passportLimit"]}
                      rules={[{
                        validator: (_, value) =>{
                          if(moment(value).diff(moment(time),'days') >= 180){
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error(t("The certificate must be valid for more than 180 days")))
                        }
                      }]}
                    >
                      <DatePicker disabledDate={(current) => {
                        return current && current.isBefore(moment(time).add(180, 'days'));
                      }} format="YYYY-MM-DD" placeholder={t("Expiration Date")} bordered={false} />
                    </Form.Item>
                  </div>
                ))}
                <div className="btn-add-box">
                  <Button
                    onClick={() => {
                      add({passportLimit: moment(time).add(180, 'days')});
                      onPassengerChange(type, fields.length + 1)
                    }}
                    type="link"
                    icon={<PlusCircleOutlined/>}
                    className="btn-add"
                    ref={addPassengerButton}
                  >
                    {t("Add Passenger")}
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </Form>}
    </>
  );
});


