import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import "./Book.less";
import { useTranslation } from "react-i18next";
import { Affix, Button, message, Modal, Tag, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ClockCircleOutlined,
  DownOutlined,
  EditOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { PassengerForm } from "src/features/passengerForm/PassengerForm";
import {
  EPassengerType,
  TPassenger,
} from "src/features/searchForm";
import { usePolicyModal } from "src/features/policyModal/PolicyModal";
import { getHeader, setHeader } from "@features/header/headerSlice";
import useFetch from "use-http";
import update from "immutability-helper";
import { ICreateOrderRequestType } from "./Interface";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { EmomentFormatType } from "src/app/common";
import { TFlightDetailType } from "@mock/flightDetail";
import { ConcatForm } from "@features/concatForm/ConcatForm";
import {
  getSearchForm,
  setSearchForm,
} from "@features/searchForm/searchFormSlice";
import { PriceTable } from "@features/priceTable/PriceTable";
import {
  displayLocaleTime,
  getAirlineLogo,
  getCityImageByCityCode,
  getCityNameByCityCode,
  getnameByCompanyCode,
  useCurrencySymbol,
} from "@common/utils";
import { Link } from "react-router-dom";
import SafeImage from "@features/safeImage/SafeImage";
import { DEFAULT_IMAGE } from "@common/commonData";
import { PolicyTable } from "@features/policyTable/PolicyTable";
import { StopInfoTable } from "@features/stopInfoTable/StopInfoTable";
import CollapsePanel from "@features/collapsePanel/CollapsePanel";
import classnames from "classnames";
import { ECurrencyType, ELanguageType } from "@features/header";
import { onLogin } from "src/userCookie";
import { showModal, setType } from "@features/header/modalShowSlice";
import { EActionType } from "@pages/user/Interface";

// import checkData from "@mock/check.json"

const { Title } = Typography;

const remarkKey={
  wego: 'wego_click_id',
  skyscanner: 'skyscanner_redirectid'
}

export const Book = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  // 全局顶部数据
  const headData = useAppSelector(getHeader);
  const [shoppingId, setShoppingId] = useState("")
  // 全局表单数据
  const searchFormAppData = useAppSelector(getSearchForm);
  const showPolicyModal = usePolicyModal();
  const navigate = useNavigate();
  const currency = useCurrencySymbol();
  const dispatch = useAppDispatch();
  const times = useRef(0);
  const [lastFlightDate, setLastFlightDate] = useState<string|null>(null)
  const urlParams = new URLSearchParams(location.search)
  // 航班详情
  const [flightData, setFlightData] = useState<TFlightDetailType>();
  // 表单数据
  const [submitData, setSubmitData] = useState<ICreateOrderRequestType>(()=>{
    const locale = urlParams.get('locale')
    const sku = urlParams.get('sku')||"";
    const skuData = new URLSearchParams(atob(sku))
    const mktportal = skuData.get('mktportal')
    const revenueId = skuData.get('revenueId')
    const profitId = skuData.get('profitId')
    const currencyRate = skuData.get('currencyRate')
    const group = skuData.get('group')
    const remark = mktportal?urlParams.get(remarkKey[mktportal]):""
    const IPCC = skuData.get('IPCC');
    const skuType = skuData.get('skutype');
    return {
      flightPassengerList: [],
      shoppingId,
      mktportal,
      remark,
      locale,
      channel: 'online',
      revenueId,
      profitId,
      currencyRate,
      group,
      IPCC,
      skuType,
    }
  });

  useEffect(()=>{
    setSubmitData(
      update(submitData, {
        shoppingId: { $set: shoppingId },
      })
    )
  },[shoppingId])

  // 当前表单乘客个数
  const [passengerList, setPassengerList] = useState<TPassenger[]>(
    searchFormAppData.passenger
  );

  // 乘客表单实例
  const getFormListRef = [useRef(), useRef(), useRef(), useRef()];

  // 航班经停信息面板的折叠信息
  const [collapseStatus, setCollapseStatus] = useState<Boolean[]>([]);

  // 航班详情
  const flightInfo = useMemo(() => {
    return flightData?.flightGroupInfoList;
  }, [flightData]);

  // 票价详情
  const policyDetailInfo = useMemo(() => {
    return flightData?.policyDetailInfo;
  }, [flightData]);

  const priceFormat = (price: string) => {
    return JSON.parse(price.replace("\\", ""));
  };

  // 查询列表数据
  const { post, error, response } = useFetch();

  const generateFlightInfo = async (params: any) => {
    // await post("/experimental/getFlight", {
    //   ...params,
    // });
    const content = await import("../../__MOCK__/flightDetail.json")
    // if (response.ok) {
      setShoppingId(content.shoppingId)
      setFlightData(content);
    // } else {
    //   error && message.error(error.message);
    // }
  };

  const deeplinkTrace = () => {
    post("/website/deeplinktrace", { queryStr: window.location.search });
  };

  // 检查票价更新
  const getFlightPrice = async (data: any, successCallback?: Function) => {
    await post("/website/check", {
      redisSchema: data.redisSchema,
      redisCode: data.redisCode,
      currency: headData.currency,
      shoppingId,
      priceId: flightData?.policyDetailInfo.priceId,
      passengerList: passengerList,
      group: data.group,
      IPCC: data.IPCC,
      skuType: flightData?.shoppingType,
    });
    if (response.ok) {
      // mock
      // response.data.content = checkData

      let { penalty, priceInfo, verifyResult, redisSchema } =
        response.data.content;
      // 价格没问题
      if (verifyResult === 0) {
        return successCallback && successCallback();
      }
      // 卖完了
      if (verifyResult === -1) {
        return Modal.error({
          title: t("info"),
          content: t("book-info-3"),
          okText: t("confirm"),
          onOk: () => {
            navigate(-1);
          },
        });
      }
      // format价格
      priceInfo.adultPrice = priceFormat(priceInfo.adultPrice);
      priceInfo.childPrice = priceFormat(priceInfo.childPrice);
      priceInfo.infantPrice = priceFormat(priceInfo.infantPrice);

      //  价格有问题，弹窗说明
      Modal.error({
        title: t("book-info-1"),
        content: t("book-info-2"),
        okText: t("confirm"),
      });
      let newData: any = null;
      if (penalty.length) {
        newData = update(flightData, {
          policyInfo: {
            penaltyInfoList: {
              $set: penalty,
            },
          },
        });
      }
      if (priceInfo?.totalPrice) {
        newData = update(newData ? newData : flightData, {
          policyDetailInfo: {
            $set: priceInfo,
          },
        });
      }
      newData.redisSchema = redisSchema;
      setFlightData(newData);
    } else {
      setOrderCreated(false)
      error && message.error(error.message);
    }
  };

  // 查询票价更新
  const getChangePrice = async () => {
    if (!flightData) return;
    await post("/website/changeprice", {
      changePassenger: passengerList,
      priceId: flightData?.policyDetailInfo.priceId,
    });
    if (response.ok) {
      setFlightData(
        update(flightData, {
          policyDetailInfo: { $set: response.data.content },
        })
      );
    } else {
      error && message.error(error.message);
    }
  };

  // 查询票价更新
  const getChangeCurrency = async () => {
    if (!flightData) return;
    await post("/website/changecurrency", {
      changePassenger: passengerList,
      priceId: flightData?.policyDetailInfo.priceId,
      shoppingId,
      currency: headData.currency,
    });
    if (response.ok) {
      setFlightData(
        update(flightData, {
          policyDetailInfo: { $set: response.data.content.priceInfo },
          policyInfo: {
            penaltyInfoList: { $set: response.data.content.penaltyInfoList },
          },
        })
      );
    } else {
      error && message.error(error.message);
    }
  };

  useEffect(() => {
    getChangeCurrency();
  }, [headData.currency]);

  useEffect(() => {
    setPassengerList(searchFormAppData.passenger);
  },[searchFormAppData])
  

  // 初次渲染时查询列表数据
  useEffect(() => {
    if(!urlParams.get("sku")) { 
      navigate("/");  
      return     
    }
    const sku = urlParams.get("sku");
    const skuData = new URLSearchParams(atob(sku||''))
    const params = {
      campaign: urlParams.get("campaign"),
      deepLinkTokenId: urlParams.get("deepLinkTokenId"),
      language: skuData.get("language"),
      locale: skuData.get("locale"),
      mktportal: skuData.get("mktportal"),
      currency: skuData.get("currency"),
      tripType: skuData.get("tripType"),
      redisCode: decodeURIComponent(skuData.get("redisCode")||''),
      segmentSchema:  decodeURIComponent(skuData.get("segmentSchema")||''),
      departTime: skuData.get("departTime"),
      returnTime: skuData.get("returnTime"),
      adult: skuData.get("adult"),
      children: skuData.get("children"),
      infant: skuData.get("infant"),
      cabinType: skuData.get("cabinType"),
      depart: skuData.get("departCity"),
      arrive: skuData.get("arriveCity"),
      skutype: skuData.get("skutype"),
      currencyRate: skuData.get("currencyRate"),
      cnyRate: skuData.get("cnyRate"),
      profitId: skuData.get("profitId"),
      revenueId : skuData.get('revenueId'),
      penaltyId: skuData.get("penaltyId"),
      baggageId: skuData.get("baggageId"),
      group: skuData.get("group"),
      IPCC: skuData.get("IPCC"),
      shoppingId: skuData.get("shoppingId"),
    };
    setLastFlightDate(skuData.get("returnTime") ? skuData.get("returnTime") : skuData.get("departTime"))
    window.scrollTo({
      top: 0,
    });
    const deeplinkSearchForm = {
      flightType: params.tripType,
      cabinType: params.cabinType,
      passenger: [
        {"name":"Adult","count":Number(params.adult),"flag":"ADT"},
        {"name":"Children","count":Number(params.children),"flag":"CHD"},
        {"name":"Infants","count":Number(params.infant),"flag":"INF"}
      ],
      tripSearch: [{
        "depart":params.depart,
        "arrive":params.arrive,
        "departTime": params.departTime?.replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3")
      }],
    };
    dispatch(setSearchForm(deeplinkSearchForm));
    const updateData: any = {};
    if (params.currency) {
      updateData.currency = { $set: ECurrencyType[params.currency] };
    }
    if (params.language) {
      languageChange(params.language);
      updateData.locale = { $set: params.language as any };
    }
    dispatch(setHeader(update(headData, { ...updateData })));
    generateFlightInfo(params);
    // refreshCache();
    // deeplinkTrace()
  }, []);

  const refreshCache = async () => {
    if(times.current > 2){
      Modal.info({
        title: t('This page has been on for too long'),
        content: t('Please search for flights again'),
        okText: t("confirm"),
        onOk: () => {
          navigate('/flightlist');
        }
      })
      return
    }
    try{
      const sku = urlParams.get("sku");
      const skuData = new URLSearchParams(atob(sku||""))

      await post("/website/refreshcache", {
        tripSearch: searchFormAppData.tripSearch,
        IPCC: skuData.get("IPCC"),
      });
    }finally{
      times.current++
      setTimeout(refreshCache, 1000 * 60 * 5);
    }
  }

  const languageChange = (value: any) => {
    i18n.changeLanguage(value);
    switch (value) {
      case ELanguageType.TChinese:{
        moment.locale("zh-hk");
        break;
      }
      case ELanguageType.Chinese:{
        moment.locale("zh-cn");
        break;
      }
      case ELanguageType.Japanese:{
        moment.locale("jp");
        break;
      }
      default:{
        moment.locale("en");
        break;
      }
    }
  };
  // 乘客列表改变后，更新价格
  useEffect(() => {
    // getChangePrice();
  }, [passengerList]);

  // 乘客表单填写完整后，创建订单
  useEffect(() => {
    if (orderCreated) {
      return;
    }
    // 设置订单已创建的标记
    if (
      submitData?.contactInfo?.contactName &&
      submitData.flightPassengerList.length
      ) {
          setOrderCreated(true)
          getFlightPrice(flightData, () => {
             postBookData();
          });
      }
  }, [submitData]);

  // 记录创单请求是否已发送
  const [orderCreated, setOrderCreated] = useState(false);

  // 下单接口
  const postBookData = async () => {
    if (orderCreated) {
      return;
    }
    // 如果订单已经创建，则不再发送请求
    await post("/experimental/booking", submitData); // will return just the user's name
    if (response.ok && response.data.status) {
      if(submitData?.contactInfo?.email && !headData.userInfo.email){
        onLogin({
          email: submitData.contactInfo.email,
          userName: submitData.contactInfo.email,
          valid: false,
        });
      }
      message.success(t("Book successful!"));
      navigate("/payment", {
        state: {
          shoppingId,
          orderId: response.data.content.orderInfo.orderId,
        },
      });
    } else {
      Modal.error({
        title: t("info"),
        content: t('Booking failed: Reservation failed'),
        okText: t("confirm"),
        onOk: () => {
          navigate("/flightlist");
        }
      });
    }
    setOrderCreated(false);
  };

  const handleSubmit = async () => {
    if(!headData.userInfo.email){
      await post("/website/isUserExist", {email: (getFormListRef?.[3]?.current as any)?.getFieldValue?.("email")});
      if (response.ok && response.data.content.isExist) {
        dispatch(setType(EActionType.login));
        dispatch(showModal());
        return;
      }
    }
    getFormListRef.forEach((form: any) => {
      const submit = form.current.submit;
      submit();
    });
  };

  const handlePlicyClick = (type: number) => {
    flightData && showPolicyModal(flightData);
  };

  const showStopInfo = (index: number) => {
    setCollapseStatus(
      update(collapseStatus, {
        [index]: { $apply: (value: Boolean) => !value },
      })
    );
  };

  const onFormFinish = (type: EPassengerType, value: any) => {
    if (!value.users || value.users.length === 0) return;

    value.users.forEach((user: any) => {
      user.travelerType = type;
      user.birthDay = user.birthDay.format(EmomentFormatType.Default);
      user.passportLimit = user.passportLimit.format(EmomentFormatType.Default);
    });
    // 表单刷新时，清空passengerList
    if (
      submitData.flightPassengerList.length !== 0 &&
      type === EPassengerType.adult
    ) {
      setSubmitData(
        update(submitData, {
          flightPassengerList: { $set: value.users, },
        })
      );
    } else {
      setSubmitData(
        update(submitData, { flightPassengerList: { $push: value.users } })
      );
    }
  };

  const onConcatFormFinish = (value: any) => {
    setSubmitData(update(submitData, { contactInfo: { $set: value } }));
  };

  // 乘客发生改变的时候请求最新的价格
  const onPassengerChange = (type: EPassengerType, len: number) => {
    const index = passengerList.findIndex((ele) => ele.flag === type);
    setPassengerList(
      update(passengerList, { [index]: { count: { $set: len } } })
    );
  };

  const handleOpenAssistanceModal = () => {
    let assistanceImage = "../../static/image/home/assistance-bg-en.png";
    if (i18n.language === "tc" || i18n.language === "cn") {
      assistanceImage = "../../static/image/home/assistance-bg.png";
    }
    Modal.info({
      title: t("Special Assistance"),
      okText: t("confirm"),
      width: 700,
      closable: true,
      content: <img src={assistanceImage}></img>,
      className: "assistance-modal",
    });
  };

  return (
    <div className="book-page-wrappr">
      <div className="left-content">
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
              <div className="top-city-info">
                <SafeImage
                  defaultImg={DEFAULT_IMAGE}
                  src={getCityImageByCityCode(
                    flight.flightSegments[0].aCityInfo.code
                  )}
                  className="city-image"
                />
                <div className="city-image-mask"></div>
                <p className="city">
                  {departMultCityName} - {arriveMultCityName}
                  <Button
                    onClick={() => navigate("/flightlist")}
                    type="link"
                    icon={<EditOutlined />}
                  >
                    {t("Change Flight")}
                  </Button>
                </p>
                <p className="pass">
                  {passengerList[0].count +
                    " " +
                    t("Adult") +
                    ", " +
                    passengerList[1].count +
                    " " +
                    t("Child") +
                    ", " +
                    passengerList[2].count +
                    " " +
                    t("Infant")}{" "}
                  <span>| </span>
                  {t("All departure/arrival times are in local time")}
                </p>
              </div>
              <div
                className={classnames("top-flight-info", {
                  active: !collapseStatus[index],
                })}
                onClick={() => {
                  showStopInfo(index);
                }}
              >
                <div className="part">
                  <Tag color="blue">{t("depart")}</Tag>
                  <span>
                    {displayLocaleTime(flight.departDateTimeFormat,EmomentFormatType.FULLTIME)}
                  </span>
                  <span>&emsp;|&emsp;</span>
                  <span>
                    {departMultCityName}&nbsp;-&nbsp;
                    {arriveMultCityName}
                  </span>
                </div>
                <div className="left-box">
                  <div className="f-info-airline">
                    <img
                      className="airline-logo"
                      src={getAirlineLogo(flight.flightSegments[0])}
                      alt=""
                    ></img>
                    <div className="f-info-desc">
                      <div className="f-info-time">
                        <span className="time">
                          {displayLocaleTime(flight.departDateTimeFormat,EmomentFormatType.TIME)}
                        </span>
                        <span className="timeSplit">-</span>
                        <span className="time">
                          {displayLocaleTime(flight.arriveDateTimeFormat,EmomentFormatType.TIME)}
                        </span>
                      </div>
                      <span className="f-name">
                        {getnameByCompanyCode(
                          flight.flightSegments[0].airlineInfo.name
                        )}
                        {/* {flight.flightSegments[0].airlineInfo.name}
                        {flight.flightSegments[0].flightNo} */}
                      </span>
                    </div>
                  </div>
                  <div className="f-info-duration">
                    <div className="time">
                      <ClockCircleOutlined />
                      {flight.duration.h}h {flight.duration.m}m
                    </div>
                    <Button type="text">{t("listInfo1")}</Button>
                  </div>
                  <div className="f-info-stop">
                    <span className="stop-text">
                      {flight.flightSegments.length > 1
                        ? `${flight.flightSegments.length - 1} ${t("stop")}`
                        : t("Direct")}
                    </span>
                    <div className="stop-code">
                      {flight.flightSegments.map((flightSegment, index) => {
                        return (
                          <span className="code" key={index}>
                            {flightSegment.dCityInfo.code} -
                          </span>
                        );
                      })}
                      <span className="code">
                        {
                          flight.flightSegments[
                            flight.flightSegments.length - 1
                          ].aCityInfo.code
                        }
                      </span>
                    </div>
                  </div>
                  <div className="btn-detail">
                    <Button type="link">
                      {t("Details")}{" "}
                      {collapseStatus[index] ? (
                        <DownOutlined />
                      ) : (
                        <UpOutlined />
                      )}{" "}
                    </Button>
                  </div>
                </div>
              </div>
              <CollapsePanel collapse={collapseStatus[index]}>
                <div className="stop-table-box">
                  <StopInfoTable
                    flightData={flight.flightSegments}
                  ></StopInfoTable>
                </div>
              </CollapsePanel>
            </div>
          );
        })}
        <div
          className="top-policy-info"
          onClick={() => {
            handlePlicyClick(1);
          }}
        >
          {flightData && (
            <PolicyTable
              tableType={0}
              policyInfo={flightData.policyInfo}
              policyDetailInfo={flightData.policyDetailInfo}
              cabinType={searchFormAppData.cabinType}
            ></PolicyTable>
          )}

        </div>
        <div className="top-book-tips">
          <div className="tips-item">
            <span className="title">{t("book-tips-1-t")}</span>
            <span className="desc">{t("book-tips-1-d")}</span>
          </div>
          {flightInfo && flightInfo.length > 1 && (
            <div className="tips-item">
              <span className="title">{t("book-tips-2-t")}</span>
              <span className="desc">{t("book-tips-2-d")}</span>
            </div>
          )}
        </div>
        <div className="center-fillin">
          <Title level={3}>{t("Passenger")}</Title>
          {/* <p className="require-info">{t("No ID number required to book.")}</p> */}
          <PassengerForm
            type={EPassengerType.adult}
            defaultValue={searchFormAppData.passenger[0]}
            onFormFinish={onFormFinish}
            ref={getFormListRef[0]}
            onPassengerChange={onPassengerChange}
            time={lastFlightDate}
          ></PassengerForm>
          <PassengerForm
            type={EPassengerType.child}
            defaultValue={searchFormAppData.passenger[1]}
            onFormFinish={onFormFinish}
            ref={getFormListRef[1]}
            onPassengerChange={onPassengerChange}
            time={lastFlightDate}
          ></PassengerForm>
          <PassengerForm
            type={EPassengerType.infant}
            defaultValue={searchFormAppData.passenger[2]}
            onFormFinish={onFormFinish}
            ref={getFormListRef[2]}
            onPassengerChange={onPassengerChange}
            time={lastFlightDate}
          ></PassengerForm>
          <Title level={3}>{t("Contact Details")}</Title>
          <ConcatForm
            onConcatFormFinish={onConcatFormFinish}
            ref={getFormListRef[3]}
          ></ConcatForm>
        </div>
        <div className="bottom-assistance">
          <p className="title">{t("Special Assistance")}</p>
          <p className="desc">{t("assistance-1")}</p>
          <img src="../../static/image/home/assistance.png" />
          <a type="text" onClick={handleOpenAssistanceModal} className="clink">
            {t("Detail")}
          </a>
        </div>
        <div className="bottom-next">
          <p className="agree-rule">
            {t("agreeBtn")}
            <Link target="_blank" to="/news/Privacy" className="clink">
              {t("Privacy Policy")}
            </Link>
            <Link target="_blank" to="/news/Terms" className="clink">
              {t("Terms and Conditions")}
            </Link>
          </p>
          <div className="total-price">
            <p>{t("Total")}</p>
            <p className="price">
              <span>{currency}</span>
              {policyDetailInfo?.totalPrice}
            </p>
          </div>
          <Button type="primary" className="btn-next" onClick={handleSubmit} disabled={orderCreated}>
            {orderCreated?t('createOrder'):t("Book")}
          </Button>
        </div>
      </div>
      <Affix className="right-content-wrapper" offsetTop={10}>
        <div className="right-content">
          <PriceTable
            priceData={policyDetailInfo}
            passengerList={passengerList}
          ></PriceTable>
        </div>
      </Affix>
    </div>
  );
};

export default Book;
