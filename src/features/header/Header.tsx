import { Button, Select, Modal, Popover } from "antd";
import React, { forwardRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ECurrencyType, ELanguageType } from "./index";
import { EActionType } from "@pages/user/Interface";
import { RegisterPage } from "@pages/user/Register";
import { LoginPage } from "@pages/user/Login";
import { ForgetPage } from "@pages/user/Forget";
import { ChangePage } from "@pages/user/Change";
import { useLocation, useNavigate } from "react-router-dom";
import update from "immutability-helper";
import "./Header.less";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  setType,
  showModal as show,
  hideModal,
} from "@features/header/modalShowSlice";
import { getHeader, setHeader } from "@features/header/headerSlice";
import moment from "moment";
import { loginOut } from "@pages/user/LoginFuncs";
import { SideBar } from "@features/sideBar/SideBar";
import classnames from "classnames";

const { Option } = Select;
export const Header = forwardRef((props: any, ref: any) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const headData = useAppSelector(getHeader);
  const visible = useAppSelector((state) => state.modalShow.visible);
  const userPageType = useAppSelector((state) => state.modalShow.type);
  const dispatch = useAppDispatch();

  const showModal = () => {
    dispatch(show());
  };

  // 判断登陆状态
  const userInfo = useMemo(() => {
    return headData.userInfo;
  }, [headData]);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      dispatch(hideModal());
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    dispatch(hideModal());
    dispatch(setType(EActionType.login));
  };

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const onClickChage = () => {
    showModal();
    dispatch(setType(EActionType.change));
  };

  const isDisableCurrencySelect = useMemo(() => {
    const disableCurrencyPath = ["/payment"];
    return disableCurrencyPath.some(
      (item) => location.pathname.indexOf(item) >= 0
    );
  }, [location]);

  // 设置语言
  const languageChange = (value: ELanguageType) => {
    i18n.changeLanguage(value);
    switch (value) {
      case ELanguageType.TChinese: {
        moment.locale("zh-hk");
        break;
      }
      case ELanguageType.Chinese: {
        moment.locale("zh-cn");
        break;
      }
      case ELanguageType.Japanese: {
        moment.locale("jp");
        break;
      }
      default: {
        moment.locale("en");
        break;
      }
    }
    // 更新stroe
    dispatch(setHeader(update(headData, { locale: { $set: value } })));
  };

  useEffect(() => {
    moment.locale(headData.locale);
    // 未登录用户进入详情页
    if (location.pathname === "/detailpage" && !headData.userInfo.email) {
      // 如果为未注册过的用户
      const search = new URLSearchParams(location.search);
      const isNewUser = search.get("isExistUser") !== "true";
      const orderid = search.get("orderid");
      if (!orderid) return;
      if (isNewUser) {
        dispatch(setType(EActionType.setPwd));
      }
      // 如果为已注册过的用户则正常展示
      showModal();
    }
  }, [headData.locale, headData.userInfo.email]);

  // 设置货币
  const currencyChange = (value: ECurrencyType) => {
    // 更新stroe
    dispatch(setHeader(update(headData, { currency: { $set: value } })));

    if (
      location.pathname.indexOf("flightlist") !== -1 &&
      location.search !== ""
    ) {
      return;
    }
    // 刷新页面
    if (location.pathname.indexOf("book") === -1) {
      window.location.reload();
    }
  };

  function handleUserPageType(pageType: EActionType) {
    dispatch(setType(pageType));
  }

  const renderUserPage = (userPageType: EActionType) => {
    switch (userPageType) {
      case EActionType.login:
        return <LoginPage handleUserPageType={handleUserPageType} />;
      case EActionType.forget:
        return (
          <ForgetPage handleUserPageType={handleUserPageType} isForget={true} />
        );
      case EActionType.register:
        return <RegisterPage handleUserPageType={handleUserPageType} />;
      case EActionType.change:
        return <ChangePage handleUserPageType={handleUserPageType} />;
      case EActionType.setPwd:
        return <ForgetPage handleUserPageType={handleUserPageType} />;
      default:
        return <LoginPage handleUserPageType={handleUserPageType} />;
    }
  };

  return (
    <div className="header-box">
      <div className={classnames("header-wrapper blue")}>
        <img
          className="title"
          src=""
          alt="logo"
          onClick={(e) => {
            navigate("/");
          }}
        />
        <div className="right-box">
          <Select
            defaultValue={headData.locale}
            value={headData.locale}
            bordered={false}
            dropdownMatchSelectWidth={120}
            onChange={languageChange}
            dropdownClassName="header-select-popup"
          >
            <Option value={ELanguageType.English}>English</Option>
            <Option value={ELanguageType.TChinese}>繁体中文</Option>
            <Option value={ELanguageType.Chinese}>简体中文</Option>
            <Option value={ELanguageType.Japanese}>日本語</Option>
            {/* <Option value={ELanguageType.Spain}>Español</Option> */}
          </Select>
          <Select
            defaultValue={headData.currency}
            value={headData.currency}
            bordered={false}
            onChange={currencyChange}
            dropdownMatchSelectWidth={120}
            disabled={isDisableCurrencySelect}
            dropdownClassName="header-select-popup"
          >
            {Object.values(ECurrencyType).map(
              (currency: string, index: number) => {
                return (
                  <Option key={index} value={currency}>
                    {currency}
                  </Option>
                );
              }
            )}
          </Select>
          <Select
            value={t("contact us")}
            dropdownMatchSelectWidth={false}
            bordered={false}
            dropdownClassName="header-select-popup"
          >
            {/* <Option value="tel">
              <div  className="contact-us">
                <img src="/static/image/home/icon_china_new.png" />
                <div className="contact-us-item">
                  <p>{t('Mainland China')}</p>
                  <p>{t("+86 17621983390")}</p>
                </div>
              </div>
            </Option> */}
            <Option value="tel_nz">
              <div className="contact-us">
                <img
                  src="/static/image/home/New_Zealand.png"
                  alt="New Zealand"
                />
                <div className="contact-us-item">
                  <p>{t("New Zealand")}</p>
                  <p className="num">{t("99999111112")}</p>
                </div>
              </div>
            </Option>
            {/* <Option>
            <div  className="contact-us">
               <img src="/static/image/home/icon_other_new.png" />
               <div className="contact-us-item">
                <p>{t('Other Locations')}</p>
                <a href="https://api.whatsapp.com/send?phone=93203261" target="_blank" rel="noreferrer">{t("whatsapp: +65 93203261")}</a>
                </div>
              </div>
            </Option> */}
            <Option value="email">
              <div className="contact-us">
                <img src="/static/image/home/mail.jpg" alt="mail" />
                <div className="contact-us-item">
                  <p>{t("Email Us")}</p>
                  <a
                    href="mailto:helpdesk@demoTrip.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("helpdesk@demoTrip.com")}
                  </a>
                </div>
              </div>
            </Option>
          </Select>
          <Button className="btn-sign" type="primary">
            {userInfo.email ? (
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Popover
                  content={
                    <div>
                      <div
                        style={{ alignItems: "center", textAlign: "center" }}
                      >
                        <Button
                          onClick={() => navigate("/detaillist")}
                          type="text"
                        >
                          {t("My Bookings")}
                        </Button>
                      </div>
                      <div
                        style={{ alignItems: "center", textAlign: "center" }}
                      >
                        <Button onClick={() => onClickChage()} type="text">
                          {t("Change password")}
                        </Button>
                      </div>
                      <div
                        style={{ alignItems: "center", textAlign: "center" }}
                      >
                        <Button onClick={() => loginOut()} type="text">
                          {t("Sign Out")}
                        </Button>
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="hover"
                >
                  <div>{t("hello") + ", " + userInfo.userName}</div>
                </Popover>
              </div>
            ) : (
              <div onClick={() => showModal()}>{t("Sign In/Register")}</div>
            )}
          </Button>
        </div>
      </div>
      <Modal
        title=""
        open={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        closable={false}
      >
        {renderUserPage(userPageType)}
      </Modal>
      <SideBar></SideBar>
    </div>
  );
});
