import { HomeOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./Footer.less";
const { Title } = Typography;

export function Footer() {
  const { t } = useTranslation();

  return (
    <div className="footer-wrapper">
      <div className="top-wrapper">
        <div className="contact-wrapper">
          <Title level={4}>{t("about")}</Title>
          <a href="/news/Company">{t("companyProfile")}</a>
          <a href="/news/Privacy">{t("Privacy Policy")}</a>
          <a href="/news/Terms">{t("Terms and Conditions")}</a>
        </div>
        <div className="contact-wrapper">
          <Title level={4}>{t("CONTACTS")}</Title>
          <p>
            <HomeOutlined />
            test
          </p>
          <p>
            <PhoneOutlined />
            {t("0101010101")}
          </p>
          <a href="mailto:test@demoTrip.com" target="_blank" rel="noreferrer">
            <MailOutlined />
            {t("Email: test@demoTrip.com")}
          </a>
        </div>
        <div className="contact-wrapper">
          <Title level={4}>{t("paymentMethod")}</Title>
          <div className="payment">
            <img
              className="paypal-logo"
              src="/static/image/home/nets.png"
              alt="nets"
            ></img>
            <img
              className="paypal-logo"
              src="/static/image/home/allpay.png"
              alt="allpay"
            ></img>
            <img
              className="paypal-logo"
              src="/static/image/home/paypallogo.jpg"
              alt="paypal"
            ></img>
            <img
              className="paypal-logo"
              src="/static/image/home/chinaUnionPay.jpg"
              alt="chinaUnionPay"
            ></img>
          </div>
          <Title level={4} className="partner-text">
            {t("Our Partners")}
          </Title>
          <div className="partner">
            <img
              className="kayak-logo"
              src="/static/image/home/kayak-logo.png"
              alt="kayak"
            ></img>
            <img
              className="sc-logo"
              src="/static/image/home/skyscanner.jpg"
              alt="skyscanner"
            ></img>
          </div>
        </div>
        <div className="contact-wrapper">
          <Title level={4}>{t("Security Certificate")}</Title>

          <img
            className="verify-logo"
            src="/static/image/home/digicert.png"
            alt="digicert"
          ></img>
          <img
            className="verify-logo"
            src="/static/image/home/visa_verified.png"
            alt="visa_verified"
          ></img>
        </div>
      </div>
      <p className="copyright">
        {t("copyright")}
        &nbsp;&nbsp;&nbsp;&nbsp;
      </p>
    </div>
  );
}
