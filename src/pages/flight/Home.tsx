import React, { useState, useEffect, useRef } from "react";
import { SearchForm } from "src/features/searchForm/SearchForm";
import "./Home.less";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { Card, message, Spin, Typography } from "antd";
import { EmomentFormatType } from "src/app/common";
import {
  displayLocaleTime,
  getCityImageByCityCode,
  getCityNameByCityCode,
  useCurrencySymbol,
} from "@common/utils";
import {
  AppstoreAddOutlined,
  GlobalOutlined,
  SwapOutlined,
  SwapRightOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import {
  initialState,
  setSearchForm,
} from "@features/searchForm/searchFormSlice";
import { useAppDispatch } from "src/app/hooks";
import update from "immutability-helper";
import { DEFAULT_IMAGE_2, useCommonHeaderData } from "@common/commonData";
import { EFlightType } from "@features/searchForm";
import SafeImage from "@features/safeImage/SafeImage";

const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currency = useCurrencySymbol();
  const dispatch = useAppDispatch();
  const headData = useCommonHeaderData();

  // 推荐航班
  const [recommendList, setRecommendList] = useState([]);

  const searchFormRef = useRef(null);
  const onSearchClick = () => {
    navigate("/flightlist");
  };

  useEffect(() => {
    dispatch(setSearchForm(initialState));
    getRecommendList();
  }, []);

  // 请求推荐城市
  const { post, loading, error, response } = useFetch();

  const getRecommendList = async () => {
    await post("/website/recommend", {
      currency: headData.currency,
    });
    if (response.ok) {
      const filterData = response.data.content
        .filter(
          (ele: any) =>
            ele.policyDetailInfo.avgPrice !== "NaN" &&
            ele.policyDetailInfo.totalPrice !== "NaN"
        )
        .slice(0, 4);
      setRecommendList(filterData);
    } else {
      error && message.error(error.message);
    }
  };

  const getRecommendTitle = (item: any) => {
    const flightGroup = item.flightGroupInfoList[0];
    const flightGroupLength = flightGroup.flightSegments.length;
    const departMultCityName =
      getCityNameByCityCode(
        item.flightGroupInfoList[0].flightSegments[0].dCityInfo.code
      ) || item.flightGroupInfoList[0].departMultCityName;
    const arriveMultCityName =
      getCityNameByCityCode(
        item.flightGroupInfoList[0].flightSegments[flightGroupLength - 1]
          .aCityInfo.code
      ) || item.flightGroupInfoList[0].arriveMultCityName;
    if (item.flightGroupInfoList.length === 1) {
      return (
        <>
          <b>{departMultCityName}</b>
          <SwapRightOutlined />
          <b>{arriveMultCityName}</b>
        </>
      );
    } else {
      return (
        <>
          <b>{departMultCityName}</b>
          <SwapOutlined />
          <b>{arriveMultCityName}</b>
        </>
      );
    }
  };

  const getRecommendImage = (index: number) => {
    return [
      "https://ak-d.tripcdn.com/images/0AS6z120008duapy700C0_C_750_500.jpg",
      "https://ak-d.tripcdn.com/images/0AS0v120008duas0z3BBA_C_750_500.jpg",
      "	https://dimg05.c-ctrip.com/images/fd/tg/g3/M03/D7/26/CggYG1bGymyAYcDvAA2KNxQbifw151_C_750_500.jpg",
      "https://dimg02.c-ctrip.com/images/100i0x000000lcy8zC02B_C_750_500.jpg",
    ][index];
  };

  const getRecommendTime = (item: any) => {
    return displayLocaleTime(
      item.flightGroupInfoList[0].departDateTimeFormat,
      EmomentFormatType.RECOMMEND
    );
  };

  const handleRecommendClick = (item: any) => {
    let tripSeach = item.flightGroupInfoList.map((group: any) => {
      const Seg = group.flightSegments;
      return {
        depart: Seg[0].dCityInfo.code,
        arrive: Seg[Seg.length - 1].aCityInfo.code,
        departTime: displayLocaleTime(
          group.departDateTimeFormat,
          EmomentFormatType.RECOMMEND
        ),
      };
    });
    const recommendForm = update(initialState, {
      tripSearch: {
        $set: tripSeach,
      },
      flightType: {
        $set:
          item.flightGroupInfoList.length === 1
            ? EFlightType.OneWay
            : EFlightType.Round,
      },
    });
    dispatch(setSearchForm(recommendForm));
    navigate("/flightlist");
  };

  return (
    <div className="home-page-wrappr">
      <div className="home-page-wrappr__top">
        <div className="bg-wrapper">
          <img src="/static/image/home/bg.jpg" className="bg"></img>
        </div>
      </div>

      <div className="home-page-wrappr__inner">
        <Title level={3} className="big">
          {t("Let your travels begin with ease.")}
        </Title>
        <SearchForm onSearchClick={onSearchClick}></SearchForm>
        <div className="adv-content">
          <div className="adv-item">
            <GlobalOutlined />
            <div className="adv-item-title">{t("Global coverage")}</div>
            <div className="adv-item-info">
              {t("Routes cover more than 5000 cities around the world")}
            </div>
          </div>
          <div className="adv-item">
            <AppstoreAddOutlined />
            <div className="adv-item-title">
              {t("One stop service guarantee")}
            </div>
            <div className="adv-item-info">
              {t(
                "After confirming the payment, you can enjoy the price and ticket guarantee"
              )}
            </div>
          </div>
          <div className="adv-item">
            <TransactionOutlined />
            <div className="adv-item-title">{t("Reliable system")}</div>
            <div className="adv-item-info">
              {t("Safe and fast online booking and payment")}
            </div>
          </div>
        </div>
        <Title level={3}>{t("Advantages of booking with demoTrip")}</Title>
        <div className="home-info-wrapper">
          <div className="info-left-box">
            <div className="info-box">
              <h4>{t("home-info-t-1")}</h4>
              <p>{t("home-info-d-1")}</p>
            </div>
          </div>
          <div className="info-right-box">
            <div className="info-right-top-box">
              <div className="info-box">
                <h4>{t("home-info-t-4")}</h4>
                <p>{t("home-info-d-4")}</p>
              </div>
              <div className="info-box">
                {/* <h4>{t('home-info-t-5')}</h4>
                <p>{t('home-info-d-5')}</p> */}
              </div>
            </div>
            <div className="info-right-bottom-box">
              <div className="info-box">
                <h4>{t("home-info-t-2")}</h4>
                <p>{t("home-info-d-2")}</p>
              </div>
              <div className="info-box">
                <h4>{t("home-info-t-3")}</h4>
                <p>{t("home-info-d-3")}</p>
              </div>
            </div>
          </div>
        </div>

        <Title level={3}>{t("Recommend")}</Title>
        <div className="home-recommend-wrapper">
          <Spin tip={t("Loading...")} spinning={loading} size="large">
            {recommendList.map((item: any, index) => {
              return (
                <Card
                  onClick={() => {
                    handleRecommendClick(item);
                  }}
                  cover={
                    <SafeImage
                      defaultImg={DEFAULT_IMAGE_2}
                      src={getCityImageByCityCode(
                        item.flightGroupInfoList[0].flightSegments[0].aCityInfo
                          .code,
                        1
                      )}
                      className="city-image"
                    />
                  }
                  className="recommend-item"
                  key={index}
                >
                  <p className="title">{getRecommendTitle(item)}</p>
                  <p className="title">{getRecommendTime(item)}</p>
                  {/* <p><UserOutlined />{t(item.flightGroupInfoList[0].flightSegments[0].cabinClass)}</p> */}
                  <p className="price">
                    <b>{currency + item.policyDetailInfo.avgPrice} </b>
                  </p>
                </Card>
              );
            })}
          </Spin>
        </div>
        {/* <Title level={3}>{t("home-info-1")}</Title>
        <div className="home-map-wrapper">
          <div className="bg-img"></div>
          <Text>{t('Travel informed. Use our interactive map to view exit and entry restrictions around the world.')}</Text>
          <div className="block">
            <Link to='healthy' className="cbtn"><SafetyOutlined />{t('Committed to Healthy Flying')}</Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
