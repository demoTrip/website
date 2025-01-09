import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import {
  displayLocaleTime,
  getCityNameByCityCode,
  useCurrencySymbol,
} from "@common/utils";
import { TFlightDetailType } from "@mock/flightDetail";
import { IContactInfo, IPassengerInfo } from "@pages/details/Interface";
import { Divider, message, Modal, Spin } from "antd";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { EmomentFormatType } from "src/app/common";
import useFetch from "use-http";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./Payment.less";
import classnames from "classnames";
import { ECurrencyType } from "@features/header";
import { getHeader, setHeader } from "@features/header/headerSlice";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import update from "immutability-helper";
import QRCode from "qrcode.react";

interface IOrderDetail {
  contactInfo: IContactInfo;
  passengerInfoList: IPassengerInfo[];
}

const PAYPAL_CLIENT_ID =
  "ATAfzqF1cSEhA7oOOyxEC48fC1gVcvV-HE9jN7aHbcR5QP9lFNhRAgk-iLIJaBhrEhr7p2n2enLLE9Bx";

const CHINA_PAY_METHOD_LIST = [
  {
    name: "Huipay",
    icon: "/static/image/home/chinapay.png",
    checked: true,
  },
  {
    name: "Allpayx",
    icon: "/static/image/home/nets.png",
    checked: false,
  },
];

const PAY_METHOD_LIST = [
  // {
  //     name: "PayPal",
  //     icon: "/static/image/home/paypal.png",
  //     checked: true
  // },
  {
    name: "Allpayx",
    icon: "/static/image/home/nets.png",
    checked: true,
  },
];

export function Payment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currency = useCurrencySymbol();
  const dispatch = useAppDispatch();
  const headData = useAppSelector(getHeader);

  const initClock = "00:10:00";
  const endClock = "00:00:10";

  // let $orderCheckTimer: number | null | undefined = null
  const $orderCheckTimer = useRef<number | null>(null);

  const paypalOptions = {
    "client-id": PAYPAL_CLIENT_ID,
    currency,
  };

  // 支付方法列表
  const [paymentList, setPaymentList] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>();

  // 慧收钱二维码
  const [huipayQrCode, setHuipayQrCode] = useState<string>("");
  const [isQrCodeModalOpen, setQrCodeModalOpen] = useState(false);

  // 航班详情
  const [flightData, setFlightData] = useState<TFlightDetailType>();

  const [orderData, setOrderData] = useState<IOrderDetail>();

  // 倒计时
  const [curClock, setCurClock] = useState(initClock);

  const [showPayment, setShowPayment] = useState(false);

  const apiKey = "8d5fac40-545b-4e43-9381-2386c1789fbb";

  const sendPayLoad = (window as any).sendPayLoad;

  const state: any = useRef(location.state);

  // 航班详情
  const flightInfo = useMemo(() => {
    return flightData?.flightGroupInfoList;
  }, [flightData]);

  // 倒计时
  useEffect(() => {
    let curTime = moment(curClock, EmomentFormatType.CLOCK);
    const timer = setTimeout(() => {
      curTime.subtract(1, "s");
      setCurClock(curTime.format(EmomentFormatType.CLOCK));
    }, 1000);
    if (moment(endClock, EmomentFormatType.CLOCK).diff(curTime, "s") >= 0) {
      clearTimeout(timer);
      setCurClock(endClock);
      Modal.error({
        title: t("book-info-1"),
        content: t("book-info-2"),
        okText: t("confirm"),
        onOk: () => {
          navigate(-1);
        },
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [curClock]);

  useEffect(() => {
    // if (!state.current) {
    //     navigate("/");
    // } else {
    //     getFlightListResult();
    // }
    if (currency === ECurrencyType.CNY) {
      setPaymentList(CHINA_PAY_METHOD_LIST);
    } else {
      setPaymentList(PAY_METHOD_LIST);
    }
    getFlightListResult();
    getOrderDetailResult();
  }, []);

  useEffect(() => {
    if (paymentList.length === 0) return;
    const checkedItem = paymentList.find((item) => item.checked);
    setPaymentMethod(checkedItem.name);
  }, [paymentList]);

  // 查询列表数据
  const { post, error, response } = useFetch();

  const getFlightListResult = async () => {
    await post("/website/shoppingdetail", {
      shoppingId: state.current.shoppingId,
    });
    if (response.ok) {
      setFlightData(response.data.content);
    } else {
      error && message.error(error.message);
    }
  };

  const getOrderDetailResult = async () => {
    await post("/website/orderdetail", {
      orderId: state.current?.orderId,
    });
    if (response.ok) {
      setOrderData({
        passengerInfoList: response?.data.content?.flightPassengerList,
        contactInfo: response?.data.content?.contactInfo[0],
      });
      // 更新stroe
      dispatch(
        setHeader(
          update(headData, {
            currency: { $set: response?.data.content?.currency },
          })
        )
      );
    } else {
      error && message.error(error.message);
    }
  };

  const handlePayMethodChange = (index: number) => {
    const newPaymentList = [...paymentList];
    newPaymentList.forEach((item) => {
      item.checked = false;
    });
    newPaymentList[index].checked = !newPaymentList[index].checked;
    setPaymentList(newPaymentList);
  };

  const handleEnetsPayButtonClick = async () => {
    await post("/website/payment", {
      orderId: state.current?.orderId || "test" + new Date().getTime(),
    }).then((data) => {
      const target = document.getElementById("ajaxResponse");

      var observe = new MutationObserver(function (mutations, observe) {
        setShowPayment(true);
      });
      // @ts-ignore: Unreachable code error
      observe.observe(target, { childList: true });

      sendPayLoad(JSON.stringify(data.texRequest), data.hmac, apiKey);
    });
  };

  // paypal支付方法
  const paypalCreateOrder = async (data: any, actions: any) => {
    const res = await post("/website/payment/paypal/create", {
      orderId: state.current?.orderId,
    });
    const { txnAmount } = res;
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            // currency_code: currencyCode,
            currency_code: "USD", // 试了下paypal只支持USD，应该是沙盒账户的问题
            value: txnAmount,
          },
          custom_id: state.current?.orderId,
        },
      ],
    });
  };

  // paypal付款成功
  const paypalOnApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async function (details: any) {
      // 服务端验证
      const res = await post("/website/payment/paypal/check", {
        orderId: details.purchase_units[0].custom_id,
        paymentId: data.orderID,
      });

      if (res.status === 200) {
        navigate("/payment/success?res=" + res.msg + "&userId=" + res.userId);
      } else {
        navigate("/payment/fail?res=" + res.msg);
      }
    });
  };

  // allpax支付方法
  const allpayxCreateOrder = async () => {
    const res = await post("/website/payment/allpayx/create", {
      orderId: state.current?.orderId,
    });
    if (res.status === 200) {
      window.location.href = res.data.url;
    }
  };

  // huipay支付方法
  const huipayCreateOrder = async () => {
    // const url = 'https://api.huishouqian.com/new_d/9581698f7ee53ea00a013016932781c073b41cbd14e9e1a232d7b18d5d742'
    // setHuipayQrCode(url)
    // setQrCodeModalOpen(true)
    // return
    const res = await post("/website/payment/huipay/create", {
      orderId: state.current?.orderId,
    });
    if (res.status === 200) {
      setHuipayQrCode(res.data.url);
      setQrCodeModalOpen(true);
      if (!$orderCheckTimer.current) {
        $orderCheckTimer.current = window.setInterval(() => {
          checkOrderStatus();
        }, 1000);
      }
    }
  };

  const checkOrderStatus = async () => {
    const res = await post("/website/payment/order_status_check", {
      orderId: state.current?.orderId,
    });

    if (res.code === 200 && res.status === 0) {
      if ($orderCheckTimer.current) {
        window.clearInterval($orderCheckTimer.current);
        $orderCheckTimer.current = null;
      }
      navigate(
        `/payment/success?res=OrderID [${state.current?.orderId}]: Payment succeeded`
      );
    }
  };

  const handleQrCodeModalCancel = () => {
    setQrCodeModalOpen(false);
    setHuipayQrCode("");
  };

  // 页面销毁后清除定时器
  useEffect(() => {
    return () => {
      if ($orderCheckTimer.current) {
        window.clearInterval($orderCheckTimer.current);
        $orderCheckTimer.current = null;
      }
    };
  }, []);

  return (
    <div className="payment-page-wrappr">
      <div className="top-box">
        <div className="count-down">{t("clock").replace("{$}", curClock)}</div>
      </div>
      <div className="content-box">
        <div className="left-box">
          <div className="pay-tab-box">
            {paymentList.map((item, index) => {
              return (
                <div
                  className={classnames("pay-tab", { active: item.checked })}
                  key={index}
                  onClick={() => {
                    handlePayMethodChange(index);
                  }}
                >
                  <img src={item.icon}></img>
                  {/* <span className="pay-tab-name">{item.name}</span> */}
                </div>
              );
            })}
          </div>
          <div
            className={classnames("pay-content", {
              active: paymentMethod === "Enets",
            })}
          >
            <div id="anotherSection">
              <fieldset>
                {!showPayment && <Spin />}
                <div id="ajaxResponse"></div>
              </fieldset>
            </div>
          </div>
          <div
            className={classnames("pay-content", {
              active: paymentMethod === "PayPal",
            })}
          >
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                createOrder={paypalCreateOrder}
                onApprove={paypalOnApprove}
              ></PayPalButtons>
            </PayPalScriptProvider>
          </div>
          <div
            className={classnames("pay-content", {
              active: paymentMethod === "Allpayx",
            })}
          >
            <div className="pay-btn" onClick={allpayxCreateOrder}>
              {t("Pay Now")}
            </div>
          </div>
          <div
            className={classnames("pay-content", {
              active: paymentMethod === "Huipay",
            })}
          >
            <div className="pay-btn" onClick={huipayCreateOrder}>
              {t("Pay Now")}
            </div>
          </div>
        </div>

        {/* <Spin tip={t("Loading...")} spinning={loading} size="large"> */}
        <div className="right-box">
          <div className="price-box">
            <p>{t("Total: ")}</p>
            <p className="total">
              {currency} {flightData?.policyDetailInfo.totalPrice}
            </p>
          </div>
          <Divider dashed />
          {flightInfo?.map((flight, index) => {
            const flightGroupLength = flight.flightSegments.length;
            const departMultCityName =
              getCityNameByCityCode(flight.flightSegments[0].dCityInfo.code) ||
              flight.departMultCityName;
            const arriveMultCityName =
              getCityNameByCityCode(
                flight.flightSegments[flightGroupLength - 1].aCityInfo.code
              ) || flight.arriveMultCityName;
            return (
              <div className="flight-top-info" key={index}>
                <div className="top-info-box">
                  <p className="city">
                    {flight.flightSegments[0].dCityInfo.code}
                  </p>
                  <img
                    className="airline-logo"
                    src="/static/image/home/icon-plane.png"
                    alt="Airline Logo"
                  ></img>
                  <p className="city right">
                    {
                      flight.flightSegments[flight.flightSegments.length - 1]
                        .aCityInfo.code
                    }
                  </p>
                </div>
                <div className="center-info-box">
                  <p className="time">
                    {departMultCityName}(
                    {flight.flightSegments[0].dPortInfo.code})
                  </p>
                  <p className="time right">
                    {arriveMultCityName}(
                    {
                      flight.flightSegments[flight.flightSegments.length - 1]
                        .aPortInfo.code
                    }
                    )
                  </p>
                </div>
                <div className="center-info-box">
                  <p className="time">
                    {displayLocaleTime(flight.departDateTimeFormat, "LLL")}
                  </p>

                  <p className="time  right">
                    {displayLocaleTime(flight.arriveDateTimeFormat, "LLL")}
                  </p>
                </div>

                <Divider dashed />
              </div>
            );
          })}
          <div className="contact-info">
            <div className="contact-name">
              <p className="title">
                <UserOutlined /> {orderData?.contactInfo.contactName}
              </p>
              <p className="title">
                <PhoneOutlined /> {orderData?.contactInfo.phoneArea}{" "}
                {orderData?.contactInfo.mobilePhone}
              </p>
              <p className="title">
                <MailOutlined /> {orderData?.contactInfo.email}
              </p>
            </div>
            {/* <div className="contact-name">
                               <p className='title'><PhoneOutlined /> {orderData?.contactInfo.contactName}</p>
                               <p className='blue'>{orderData?.contactInfo.phoneArea} {orderData?.contactInfo.mobilePhone}&emsp;{orderData?.contactInfo.email}</p>
                            </div> */}
          </div>
        </div>
        {/* </Spin> */}
      </div>
      <Modal
        className="code-modal"
        title="QR Code"
        open={isQrCodeModalOpen}
        onCancel={handleQrCodeModalCancel}
      >
        <div className="code-modal-content">
          <QRCode value={huipayQrCode} renderAs="canvas" />
          <img
            className="go-huipay"
            src="/static/image/home/huipay.jpg"
            alt="Huipay QR Code"
          ></img>
        </div>
      </Modal>
    </div>
  );
}

export default Payment;
