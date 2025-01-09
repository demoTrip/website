import React, {
  useState,
  useEffect,
} from "react";
import "./DetailPage.less";
import { useTranslation } from "react-i18next";
import { IContactInfo, IPassengerInfo } from "./Interface";
import { FileTextOutlined } from "@ant-design/icons";
import { FlightGroupInfoList, PolicyDetailInfo, PolicyInfo, TFlightDetailType } from "@mock/flightDetail";
import { getStatus } from './DetailList';
import update from "immutability-helper";
import { Affix, Button, Tag, Typography } from "antd";
import { ClockCircleOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { usePolicyModal } from "src/features/policyModal/PolicyModal";
import useFetch from "use-http";
import { useLocation } from "react-router-dom";
import { EmomentFormatType } from "src/app/common";
import { PriceTable } from "@features/priceTable/PriceTable";
import { displayLocaleTime, getAirlineLogo, getCityImageByCityCode, getCityNameByCityCode, getnameByCompanyCode } from "@common/utils";
import { StopInfoTable } from "@features/stopInfoTable/StopInfoTable";
import CollapsePanel from "@features/collapsePanel/CollapsePanel";
import classnames from "classnames";
import { TPassenger } from "@features/searchForm";
import { PolicyTable } from "@features/policyTable/PolicyTable";
import { useAppSelector } from "src/app/hooks";
import { getHeader } from "@features/header/headerSlice";
const { Title, Text } = Typography;

export const DetailPage = () => {
  const { t } = useTranslation();
  const showPolicyModal = usePolicyModal();
  const [detailData, setData] = useState<any>();
  const {userInfo} = useAppSelector(getHeader)
  const [isLogin, setIsLogion] = useState(!!userInfo.email)

  const { post, response } = useFetch();
  // 航班经停信息面板的折叠信息
  const [collapseStatus, setCollapseStatus] = useState<Boolean[]>([])

  const location = useLocation()
  useEffect(() => {
      setIsLogion(!!userInfo.email)
  }, [userInfo.email]);
  
  useEffect(() => {
    if(!isLogin) return
    const { search }: any = location
    const orderId = new URLSearchParams(search).get('orderid')
    async function fetchData() {
      await post("/website/orderdetail", {
        orderId,
      });
      const text = await response.text();
      console.log(text)
      setData(JSON.parse(text) as any);
    }
    fetchData();
  }, [isLogin]);

  const showStopInfo = (index: number) => {
    setCollapseStatus(update(collapseStatus, { [index]: { $apply: (value: Boolean) => !value } }))
  };

  const setPriceTablePassenger = (passengerList: IPassengerInfo[]): TPassenger[]  => {
    let adtCount = 0;
    let chdCount = 0;
    let infCount = 0;
    for (let item of passengerList) {
      switch (item.travelerType) {
        case 'ADT':
          adtCount ++;
          break;
        case 'CHD':
          chdCount ++;
          break;
        case 'INF':
          infCount ++;
          break;
      }
    }
    return [
      {count: adtCount} as TPassenger,
      {count: chdCount} as TPassenger,
      {count: infCount} as TPassenger
    ];
  }

  // flightInfo = detailData as IFlightGroupInfo;
  const flightInfo: FlightGroupInfoList[] = detailData?.content?.shoppingInfo?.flightGroupInfoList;
  const policyDetailInfo: PolicyDetailInfo = detailData?.content?.shoppingInfo?.policyDetailInfo;
  const policyInfo: PolicyInfo = detailData?.content?.shoppingInfo?.policyInfo;
  const passengerList: IPassengerInfo[] = detailData?.content?.flightPassengerList;
  const passengerCount = passengerList && setPriceTablePassenger(passengerList);
  const contactInfo: IContactInfo[] = detailData?.content?.contactInfo;
  if(!isLogin) {
    return <span className="detail-page-wrappr" style={{
      height: '300px',
      justifyContent: 'center',
      alignItems: 'center'
    }}>{t('viewDetailAfterLogin')}</span>
  }
  if (!flightInfo) {
    return null;
  }
  const handlePolicyClick = (type: number) => {
    const policyModalInfo = {
      flightGroupInfoList: flightInfo,
      policyInfo
    }
    flightInfo && showPolicyModal(policyModalInfo as TFlightDetailType);
  };
  return (
    <div className="detail-page-wrappr">
      <div className="left-content">
        {/* <div className="top-city-info">
          <p className="city">
            {flightInfo.departMultCityName} - {flightInfo.arriveMultCityName}
          </p>
          <p className="pass">
            1 Adult, 1 Child <span>|</span>
            {t("All departure/arrival times are in local time")}
          </p>
        </div> */}
        <div className="top-detail-info">
          <Title level={3} className="state">
            {getStatus(detailData?.content.status, t)}
          </Title>
          <Text className="number">
            <FileTextOutlined></FileTextOutlined>{`${t('Booking No.')} ${detailData?.content.orderId}`}
          </Text>
        </div>
        {flightInfo?.map((flight, index) => {
          const flightGroupLength = flight.flightSegments.length
          const departMultCityName = getCityNameByCityCode(flight.flightSegments[0].dCityInfo.code) || flight.departMultCityName
          const arriveMultCityName = getCityNameByCityCode(flight.flightSegments[flightGroupLength-1].aCityInfo.code) || flight.arriveMultCityName
          return (
            <div className="flight-top-info" key={index}>
              <div className="top-city-info" style={{background:`url(${(getCityImageByCityCode(flight.flightSegments[flight.flightSegments.length - 1].aCityInfo.code))})` }}>
                <p className="city">
                  {departMultCityName} - {arriveMultCityName}
                </p>
                <p className="pass">
                  {passengerCount[0].count +
                    " " +
                    t("Adult") +
                    ", " +
                    passengerCount[1].count +
                    " " +
                    t("Child") +
                    ", " +
                    passengerCount[2].count +
                    " " +
                    t("Infant")}{" "}
                  <span>| </span>
                  {t("All departure/arrival times are in local time")}
                </p>
              </div>
              <div className={classnames("top-flight-info", {
                active: collapseStatus[index],
              })} onClick={() => {
                showStopInfo(index);
              }}>
                <div className="part">
                  <Tag color="blue">{t("depart")}</Tag>
                  <span>
                    {displayLocaleTime(flight.departDateTimeFormat)}
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
                      src={getAirlineLogo(flight.flightSegments[flight.flightSegments.length - 1])}
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
                        {getnameByCompanyCode(flight.flightSegments[0].airlineInfo.name)}
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
                  <div
                    className="f-info-stop"
                  >
                    <span className="stop-text">
                      {flight.flightSegments.length > 1
                        ? `${flight.flightSegments.length - 1} ${t(
                          "stop"
                        )}`
                        : t("Direct")}
                    </span>
                    <div className="stop-code">
                      {
                        flight.flightSegments.map(
                          (flightSegment, index) => {
                            return (
                              <span className="code" key={index}>
                                {flightSegment.dCityInfo.code} -
                              </span>
                            );
                          }
                        )}
                      <span className="code">
                        {flight.flightSegments[flight.flightSegments.length - 1].aCityInfo.code}
                      </span>
                    </div>
                  </div>
                  <div className="btn-detail">
                    <Button type="link">{t('Details')} {
                      collapseStatus[index] ? <UpOutlined /> : <DownOutlined />
                    } </Button>
                  </div>
                </div>
              </div>
              <CollapsePanel collapse={!collapseStatus[index]}>
                <div className="stop-table-box">
                  <StopInfoTable flightData={flight.flightSegments}></StopInfoTable>
                </div>
              </CollapsePanel>
            </div>
          );
        })}
        <div className="top-policy-info" onClick={() => {
          handlePolicyClick(1);
        }}>
          {
            detailData && (
              <PolicyTable
                tableType={0}
                policyInfo={policyInfo}
                policyDetailInfo={policyDetailInfo}
                cabinType={detailData.cabinType}
              ></PolicyTable>
            )
          }
        </div>
        <div className="center-fillin">
          <Title level={3}>{t("Passenger")}</Title>
          {passengerList.map((passengerInfo, index) => {
            return (
              <div key={index}>
                <Title level={4}>{`·${passengerInfo.givenName} ${passengerInfo.surName}`}</Title>
                <div className="center-fillin-context">
                  <Text>{`${t("Nationality")}: ${passengerInfo.nationality}`}</Text>
                </div>
                <div className="center-fillin-context">
                  <Text>{`${t("Gender")}: ${passengerInfo.gender}`}</Text>
                </div>
                <div className="center-fillin-context">
                  <Text>{`${t("Date of birth")}: ${passengerInfo.birthDay}`}</Text>
                </div>
                <div className="center-fillin-context">
                  <Text>{`PNR: ${passengerInfo.pnrInfo?passengerInfo.pnrInfo.number:''}`}</Text>
                </div>
              </div>
            )
          })}
        </div>
        <div className="center-fillin">
          <Title level={3}>{t("Contact Details")}</Title>
          {contactInfo.map((item, index) => {
            return (<div key={index}>
              <Title level={4}>{`·${item.contactName}`}</Title>
              <div className="center-fillin-context">
                <Text>{`${t("mobilePhone")}: ${item.mobilePhone || ''}`}</Text>
              </div>
              <div className="center-fillin-context">
                <Text>{`${t("Email")}: ${item.email || ''}`}</Text>
              </div>
            </div>)
          })}
        </div>
      </div>
      <Affix className="right-content-wrapper" offsetTop={10}>
        <div className="right-content">
          <PriceTable priceData={policyDetailInfo} passengerList={passengerCount}></PriceTable>
        </div>
      </Affix>
    </div>
  );
};

export default DetailPage

