import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./FlightList.less";
import { useTranslation } from "react-i18next";
import { SearchForm } from "@features/searchForm/SearchForm";
import { EPassengerType } from "src/features/searchForm";
import { PolicyTable } from "@features/policyTable/PolicyTable";
import { usePolicyModal } from "@features/policyModal/PolicyModal";
import { useStopInfoModal } from "@features/stopInfoModal/StopInfoModal";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Button,
  message,
  Checkbox,
  CheckboxOptionType,
  Slider,
  Skeleton,
} from "antd";
import classnames from "classnames";
import update from "immutability-helper";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
// import flightListDataMock from "@mock/ow2.json";
import {
  FlightGroupInfoList,
  FlightSegment,
  PolicyDetailInfo,
  PolicyInfo,
  TFlightDetailType,
} from "@mock/flightDetail";
import { useAppSelector, useAppDispatch } from "src/app/hooks";
import {
  getSearchForm,
  setSearchForm,
} from "@features/searchForm/searchFormSlice";
import moment from "moment";
import { EFlightType, TFlightSearch } from "@features/searchForm";
import { getHeader, setHeader } from "@features/header/headerSlice";
import { EmomentFormatType } from "src/app/common";
import {
  useCurrencySymbol,
  getnameByCompanyCode,
  getAirlineLogo,
  getCityMultiName,
  getCityImageByCityCode,
  getAirLineByLocal,
  displayLocaleTime,
} from "@common/utils";
import { SliderMarks } from "antd/lib/slider";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import SafeImage from "@features/safeImage/SafeImage";
import { DEFAULT_IMAGE } from "@common/commonData";
import CollapsePanel from "@features/collapsePanel/CollapsePanel";
import { ECurrencyType, ELanguageType } from "@features/header";

const SkeletonEle = (
  <Skeleton active paragraph={{ rows: 2, width: ["100%", "100%"] }} />
);
const SkeletonEleNoResult = (
  <Skeleton paragraph={{ rows: 2, width: ["100%", "100%"] }} />
);
const SkeletonLine = <Skeleton active paragraph={{ rows: 0, width: "100%" }} />;

const FlightList = () => {
  const { t, i18n } = useTranslation();
  const showPolicyModal = usePolicyModal();
  const showStopInfoModal = useStopInfoModal();
  const headData = useAppSelector(getHeader);
  const dispatch = useAppDispatch();
  const currency = useCurrencySymbol();

  // 航班总体数据，保持不变
  const [flightListAllData, setFlightListAllData] = useState<
    TFlightDetailType[]
  >([]);

  // 是否在点击请求数据
  const [onClickRefresh, setOnClickRefresh] = useState(false);

  const [isDeeplink, setIsDeeplink] = useState(false);

  // 航班展示数据
  const [flightListData, setFlightListData] = useState<TFlightDetailType[]>([]);

  // 用户选择到了第几步航程
  const [selectIndex, setSelectIndex] = useState(0);
  // 用户选择的航班id
  const [selectFlightId, setSelectFlightId] = useState("");
  // 用户选择的航班
  const [selectFlight, setSelectFlight] = useState<FlightGroupInfoList>();

  // 列表item的选中态
  // const [showBookList, setShowBooklist] = useState(
  //   Array.from({ length: flightListData.length }, () => ({ active: false }))
  // );

  const [collapseStatus, setCollapseStatus] = useState<Boolean[]>([]);

  // filter选项
  const [airlineFilterOptions, setAirlineFilterOptions] = useState<
    CheckboxOptionType[]
  >([]);
  const [stepFilterValue, setStepFilterValue] = useState<CheckboxValueType[]>(
    []
  );
  const [airlineFilterValue, setAirlineFilterValue] = useState<
    CheckboxValueType[]
  >([]);
  const [timeFliterDepart, setTimeFliterDepart] = useState<[number, number]>([
    0, 24,
  ]);
  const [timeFliterArrive, setTimeFliterArrive] = useState<[number, number]>([
    0, 24,
  ]);
  const languageChange = (value: any) => {
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
  };
  /** 在mount前将状态赋值 */
  const deepLinkStatus = useMemo(() => {
    if (window.location.search === "") {
      setIsDeeplink(false);
      return false;
    } else {
      setIsDeeplink(true);
      const urlParams = new URLSearchParams(window.location.search);
      const currency = urlParams.get("currency")?.toUpperCase();
      const locale = urlParams.get("locale")?.toLowerCase();
      const language = urlParams.get("language")?.toLowerCase();
      const params = {
        // flightType: urlParams.get("flightType"),
        tripType: urlParams.get("tripType"),
        cabinType: urlParams.get("cabinType"),

        passenger: [
          {
            name: "Adult",
            count: Number(urlParams.get("adult")),
            flag: EPassengerType.adult,
          },
          {
            name: "Children",
            count: Number(urlParams.get("children")),
            flag: EPassengerType.child,
          },
          {
            name: "Infants",
            count: Number(urlParams.get("infant")),
            flag: EPassengerType.infant,
          },
        ],
        tripSearch:
          urlParams.get("tripType") === "OW"
            ? [
                {
                  depart: urlParams.get("departCity"),
                  arrive: urlParams.get("arriveCity"),
                  departTime: moment(urlParams.get("departTime")).format(
                    "YYYY-MM-DD"
                  ),
                },
              ]
            : [
                {
                  depart: urlParams.get("departCity"),
                  arrive: urlParams.get("arriveCity"),
                  departTime: moment(urlParams.get("departTime")).format(
                    "YYYY-MM-DD"
                  ),
                },
                {
                  arrive: urlParams.get("departCity"),
                  depart: urlParams.get("arriveCity"),
                  departTime: moment(urlParams.get("returnTime")).format(
                    "YYYY-MM-DD"
                  ),
                },
              ],
      };

      const updateData: any = {};

      if (currency) {
        updateData.currency = { $set: ECurrencyType[currency] };
      }
      if (locale || language) {
        languageChange(locale || language);
        updateData.locale = { $set: (locale || language) as any };
      }

      // 更新stroe
      dispatch(setHeader(update(headData, { ...updateData })));

      const deeplinkSearchForm = {
        flightType: params.tripType,
        cabinType: params.cabinType,
        passenger: params.passenger,
        tripSearch: params.tripSearch,
      };

      dispatch(setSearchForm(deeplinkSearchForm));
      return deeplinkSearchForm;
    }
  }, [window.location.search]);

  // deeplink场景逻辑
  useEffect(() => {
    if (!deepLinkStatus) return;
    const callService = async () => {
      const res = await getFlightListResult({
        ...deepLinkStatus,
        currency: headData.currency,
        locale: headData.locale,
      });
      if (res) {
        setIsDeeplink(false);
      }
    };
    callService();
  }, []);

  useEffect(() => {
    setSelectIndex(0);
    setFlightListData(flightListAllData);
  }, [flightListAllData]);

  useEffect(() => {
    setCollapseStatus([]);
  }, [flightListData]);

  const showPolicyInfo = (index: number) => {
    const flightData = flightListData[index];
    showPolicyModal(flightData);
  };

  const showStopInfo = (index: number) => {
    const stopData =
      flightListData[index].flightGroupInfoList[selectIndex].flightSegments;
    showStopInfoModal(stopData);
  };

  const handleShowBookList = useCallback(
    (index: number) => {
      setCollapseStatus(
        update(collapseStatus, {
          [index]: { $apply: (value: Boolean) => !value },
        })
      );
    },
    [collapseStatus]
  );

  const onSearchClick = async (searchFormData?: TFlightSearch) => {
    setOnClickRefresh(true);
    getFlightListResult({
      ...searchFormData,
      currency: headData.currency,
      locale: headData.locale,
    });
  };

  const handleBookClick = (index: number) => {
    // 如果是单程或者是多程的最后一步选择，直接跳转到book页下单
    if (
      searchFormAppData.flightType === EFlightType.OneWay ||
      selectIndex === searchFormAppData.tripSearch.length - 1
    ) {
      // 未登录
      window.location.href = flightListData[index].deeplink;
    } else {
      // 继续选择下一步航程的选择
      setSelectFlight(flightListData[index].flightGroupInfoList[0]);
      setSelectFlightId(flightListData[index].flightGroupInfoList[0].flightId);
      scrollToTop();
      onSelectStep(1);
    }
  };

  // 回退选择
  const onSelectStep = (step: number) => {
    let newSelectIndex = selectIndex + step;
    setSelectIndex(newSelectIndex);
  };

  useEffect(() => {
    // 清空筛选框
    if (selectIndex >= 0) {
      setStepFilterValue([]);
      setAirlineFilterValue([]);
      setTimeFliterDepart([0, 24]);
      setTimeFliterArrive([0, 24]);
    }
    const newFlightListData = getCurFlightListData();
    setFlightListData(newFlightListData);
  }, [selectIndex]);

  // 获取当前列表的显示数据
  const getCurFlightListData = () => {
    return selectIndex === 0
      ? flightListAllData
      : flightListAllData.filter(
          (data) => data.flightGroupInfoList[0].flightId === selectFlightId
        );
  };

  // 全局表单数据
  const searchFormAppData = useAppSelector(getSearchForm);

  // 正式提交的表单
  const newSubmitData = useMemo(() => {
    if (isDeeplink) return; // deeplink状态下不触发
    let newData: any = {
      ...searchFormAppData,
      currency: headData.currency,
      locale: headData.locale,
    };
    // delete newData.cabinType;
    return newData;
  }, [searchFormAppData, headData.currency]);

  const { post, error, response } = useFetch();
  const [loading, setLoading] = useState<boolean>(true);

  // 更新列表
  const getFlightListResult = async (searchFormData?: any) => {
    setLoading(true);

    try {
      // await post("/experimental/getFlights", searchFormData || newSubmitData);
      const mock = await import("../../__MOCK__/flightList.json")
      setOnClickRefresh(false);
      // if (response.ok) {
        // const data = getSortList(response.data.content);
        const data = getSortList(mock.content);
        getAirlineFiltetOptions(data);
        setFlightListAllData(data);
        return true
      // } else {
      //   error && message.error(error.message);
      // }
    } finally {
      setLoading(false);
    }
  };

  const getSortList = (rawData: TFlightDetailType[]): TFlightDetailType[] => {
    // 数组去重
    const filterData: TFlightDetailType[] = [];
    rawData.forEach((data: TFlightDetailType) => {
      if (
        filterData.every(
          (f) => f.redisSchema.split("|")[0] !== data.redisSchema.split("|")[0]
        )
      ) {
        filterData.push(data);
      }
    });
    return filterData;
  };

  useEffect(() => {
    if (onClickRefresh || isDeeplink) return;
    getFlightListResult();
  }, [newSubmitData]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  const stepFilterOptions = [
    { label: t("Direct"), value: 1 },
    { label: t("1 stop"), value: 2 },
    { label: t("2+ stops"), value: 3 },
  ];

  const marks: SliderMarks = {
    0: "00:00",
    24: "24:00",
  };

  const tipFormatter = (value?: number) =>
    value ? `${value > 9 ? value : "0" + value}:00` : "00:00";

  const getAirlineFiltetOptions = (data: TFlightDetailType[]) => {
    const airlineRawCode: string[] = data.map((flightData) => {
      const flightDetail: FlightGroupInfoList =
        flightData.flightGroupInfoList[selectIndex];
      const flightSeg: FlightSegment = flightDetail.flightSegments[0];
      return flightSeg.airlineInfo.code;
    });
    const airlineName: CheckboxOptionType[] = Array.from(
      new Set(airlineRawCode.filter((n) => n))
    )
      .map((code) => {
        return {
          label: getnameByCompanyCode(code),
          value: code,
        };
      })
      .filter((n) => n.label);
    setAirlineFilterOptions(airlineName);
  };

  useEffect(() => {
    getAirlineFiltetOptions(getCurFlightListData());
  }, [headData.locale]);

  const onfilterChange = (filterValue: any, type: string) => {
    if (type === "step") {
      setStepFilterValue(filterValue);
    }
    if (type === "airline") {
      setAirlineFilterValue(filterValue);
    }
  };

  const ontimeFliterChange = (value: [number, number], type: string) => {
    type === "depart" ? setTimeFliterDepart(value) : setTimeFliterArrive(value);
  };

  useEffect(() => {
    const curFlightListData = getCurFlightListData();
    const newFlightListData = curFlightListData.filter((f) => {
      const fGroup = f.flightGroupInfoList[selectIndex];
      const fdt = moment(fGroup.departDateTimeFormat).hour();
      const fat = moment(fGroup.arriveDateTimeFormat).hour();
      const fstep = fGroup.flightSegments.length;
      const fcode = fGroup.flightSegments[0].airlineInfo.code;
      const stepResult = stepFilterValue.length
        ? stepFilterValue.some((val: any) =>
            val > 2 ? fstep >= val : fstep === val
          )
        : true;
      const airResult = airlineFilterValue.length
        ? airlineFilterValue.some((val: any) => fcode === val)
        : true;
      const dtResult = fdt >= timeFliterDepart[0] && fdt < timeFliterDepart[1];
      const atResult = fat >= timeFliterArrive[0] && fat < timeFliterArrive[1];
      return stepResult && airResult && dtResult && atResult;
    });
    setFlightListData(newFlightListData);
  }, [stepFilterValue, airlineFilterValue, timeFliterDepart, timeFliterArrive]);

  const getTimeFliterDepart = (type: string) => {
    const time: any = type === "depart" ? timeFliterDepart : timeFliterArrive;
    return (
      (time[0] < 10 ? "0" + time[0] : time[0]) +
      ":00 - " +
      (time[1] < 10 ? "0" + time[1] : time[1]) +
      ":00"
    );
  };

  return (
    <div className="flight-list-wrapper">
      <div className="top-search-wrapper">
        <SearchForm onSearchClick={onSearchClick}></SearchForm>
        <div className="top-time-price-list"></div>
      </div>
      <div className="container">
        {loading && (
          <>
            <div className="left-box">
              <div className="filter-list">{SkeletonEle}</div>
              <div className="filter-list">{SkeletonEle}</div>
              <div className="filter-list">{SkeletonEle}</div>
            </div>
            <div className="content">
              <div className="select-card-wrapper">
                <div className="stacked-color"></div>
                <div className="top">{SkeletonLine}</div>
              </div>
              <div className="list-wrapper">
                <div className="list-detail">
                  <div className="f-info-content">{SkeletonEle}</div>
                </div>
                <div className="list-detail">
                  <div className="f-info-content">{SkeletonEle}</div>
                </div>
                <div className="list-detail">
                  <div className="f-info-content">{SkeletonEle}</div>
                </div>
                <div className="list-detail">
                  <div className="f-info-content">{SkeletonEle}</div>
                </div>
                <div className="list-detail">
                  <div className="f-info-content">{SkeletonEle}</div>
                </div>
                <div className="list-detail">
                  <div className="f-info-content">{SkeletonEle}</div>
                </div>
              </div>
            </div>
          </>
        )}
        {!loading && flightListAllData.length > 0 && (
          <div className="left-box">
            <div className="filter-list">
              <div className="filter-title">{t("Transfer")}</div>
              <div className="filter-item">
                <Checkbox.Group
                  value={stepFilterValue}
                  options={stepFilterOptions}
                  onChange={(value) => {
                    onfilterChange(value, "step");
                  }}
                />
              </div>
            </div>
            <div className="filter-list">
              <div className="filter-title">{t("Airline preferences")}</div>
              <div className="filter-item">
                <Checkbox.Group
                  value={airlineFilterValue}
                  options={airlineFilterOptions}
                  onChange={(value) => {
                    onfilterChange(value, "airline");
                  }}
                />
              </div>
            </div>
            <div className="filter-list">
              <div className="filter-title">{t("Times")}</div>
              <div className="filter-span">
                {t("Departure time")} {getTimeFliterDepart("depart")}
              </div>
              <div className="filter-item time">
                <Slider
                  range
                  step={1}
                  marks={marks}
                  min={0}
                  max={24}
                  value={timeFliterDepart}
                  defaultValue={[0, 24]}
                  onChange={(value: [number, number]) => {
                    ontimeFliterChange(value, "depart");
                  }}
                  tipFormatter={tipFormatter}
                />
              </div>
              <div className="filter-span">
                {t("Arrival time")} {getTimeFliterDepart("arrive")}
              </div>
              <div className="filter-item time">
                <Slider
                  range
                  step={1}
                  marks={marks}
                  min={0}
                  max={24}
                  value={timeFliterArrive}
                  defaultValue={[0, 24]}
                  onChange={(value: [number, number]) => {
                    ontimeFliterChange(value, "arrive");
                  }}
                  tipFormatter={tipFormatter}
                />
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div className="content">
            {searchFormAppData.flightType !== EFlightType.OneWay &&
              flightListData.length !== 0 && (
                <>
                  {selectIndex > 0 && (
                    <div className="select-card-wrapper">
                      <SafeImage
                        defaultImg={DEFAULT_IMAGE}
                        src={getCityImageByCityCode(
                          flightListData[0].flightGroupInfoList[selectIndex]
                            .flightSegments[0].aCityInfo.code
                        )}
                        className="city-image"
                      />
                      <div className="stacked-color"></div>
                      <div className="top">
                        <p>
                          {t("Returning to")}{" "}
                          {getCityMultiName(selectFlight, 1)}
                        </p>
                        <span className="length">
                          <CheckCircleFilled />
                          {t("flightlen").replace(
                            "{$}",
                            flightListData.length.toString()
                          )}
                        </span>
                      </div>
                      <div className="center">
                        <div className="label">{t("Depart")}</div>
                        <p className="depart">
                          {displayLocaleTime(
                            selectFlight?.departDateTimeFormat,
                            EmomentFormatType.RECOMMEND
                          )}
                        </p>
                        <p className="time">
                          <span className="time">
                            {displayLocaleTime(
                              selectFlight?.departDateTimeFormat,
                              EmomentFormatType.TIME
                            )}
                          </span>
                          <span className="timeSplit">-</span>
                          <span className="time">
                            {displayLocaleTime(
                              selectFlight?.arriveDateTimeFormat,
                              EmomentFormatType.TIME
                            )}
                          </span>
                        </p>
                        <p className="city">{getCityMultiName(selectFlight)}</p>
                        <p className="time">
                          <ClockCircleOutlined />
                          {selectFlight?.duration.h}h&nbsp;
                          {selectFlight?.duration.m}m
                        </p>
                        <Button
                          type="primary"
                          size="small"
                          icon={<ArrowLeftOutlined />}
                          className="btn-back"
                          onClick={(e) => {
                            onSelectStep(-1);
                          }}
                        >
                          {t("Change Flight")}
                        </Button>
                      </div>
                    </div>
                  )}
                  {selectIndex === 0 && (
                    <div className="step-wrapper">
                      <SafeImage
                        defaultImg={DEFAULT_IMAGE}
                        src={getCityImageByCityCode(
                          flightListData[0].flightGroupInfoList[selectIndex]
                            .flightSegments[0].aCityInfo.code
                        )}
                        className="city-image"
                      />
                      <div className="stacked-color"></div>
                      <p className="city">
                        {getCityMultiName(
                          flightListData[0].flightGroupInfoList[selectIndex]
                        )}
                      </p>
                      <span className="length">
                        <CheckCircleFilled />
                        {t("flightlen").replace(
                          "{$}",
                          flightListData.length.toString()
                        )}
                      </span>
                    </div>
                  )}
                </>
              )}
            {searchFormAppData.flightType === EFlightType.OneWay &&
              flightListData.length !== 0 && (
                <div className="step-wrapper">
                  <SafeImage
                    defaultImg={DEFAULT_IMAGE}
                    src={getCityImageByCityCode(
                      flightListData[0].flightGroupInfoList[selectIndex]
                        .flightSegments[0].aCityInfo.code
                    )}
                    className="city-image"
                  />
                  <div className="stacked-color"></div>
                  <p className="city">
                    {getCityMultiName(
                      flightListData[0].flightGroupInfoList[selectIndex]
                    )}
                  </p>
                  <span className="length">
                    <CheckCircleFilled />
                    {t("flightlen").replace(
                      "{$}",
                      flightListData.length.toString()
                    )}
                  </span>
                </div>
              )}
            <div className="list-wrapper">
              {flightListData.length === 0 && !loading && (
                <div className="container">
                  <>
                    <div className="left-box">
                      <div className="filter-list">{SkeletonEleNoResult}</div>
                      <div className="filter-list">{SkeletonEleNoResult}</div>
                      <div className="filter-list">{SkeletonEleNoResult}</div>
                    </div>
                    <div className="content">
                      {
                        <div className="step-wrapper">
                          <SafeImage
                            defaultImg={DEFAULT_IMAGE}
                            src={getCityImageByCityCode(
                              searchFormAppData.tripSearch[0].arrive
                                ? searchFormAppData.tripSearch[0].arrive
                                : ""
                            )}
                            className="city-image"
                          />
                          <div className="stacked-color"></div>
                          <p className="city">
                            {getAirLineByLocal(searchFormAppData.tripSearch)}
                          </p>
                          <span className="length">
                            <CheckCircleFilled />
                            {t("flightlen").replace("{$}", "0")}
                          </span>
                        </div>
                      }
                      <div className="list-wrapper">
                        <div className="gKzZXe">
                          <div className="iRdFSI">
                            <img
                              src={"/static/image/home/search_no_result.png"}
                              alt=""
                            />
                          </div>
                          <div className="iRFzgp">{t("no-find")}</div>
                          <div className="iRFzgp">{t("retry-search")}</div>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              )}
              {flightListData.map((flightData: TFlightDetailType, index) => {
                const flightDetail: FlightGroupInfoList =
                  flightData.flightGroupInfoList[selectIndex];
                const flightPolicy: PolicyInfo = flightData.policyInfo;
                const flightPolicyDetailInfo: PolicyDetailInfo =
                  flightData.policyDetailInfo;
                const flightSeg: FlightSegment = flightDetail.flightSegments[0];
                return (
                  <div className="list-detail" key={index}>
                    <div
                      className={classnames("f-info-content", {
                        show: collapseStatus[index],
                      })}
                    >
                      <div className="airline-info">
                        <div className="f-info-airline">
                          <img
                            className="airline-logo"
                            src={getAirlineLogo(flightSeg)}
                            alt=""
                          ></img>
                          <div className="f-info-desc">
                            <span className="f-name">
                              {getnameByCompanyCode(flightSeg.airlineInfo.name)}
                            </span>
                          </div>
                        </div>
                        <div className="f-info-flight-no">
                          {flightDetail.flightSegments.map((v) => (
                            <p key={v.airlineInfo.code + v.flightNo}>
                              {v.airlineInfo.code + v.flightNo}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div
                        className="left-box"
                        onClick={() => {
                          showStopInfo(index);
                        }}
                      >
                        <div className="f-info-time">
                          <div className="time-left-box">
                            <span className="time">
                              {displayLocaleTime(
                                flightDetail.departDateTimeFormat,
                                EmomentFormatType.TIME
                              )}
                            </span>
                            <span className="code">
                              {flightDetail.flightSegments[0].dCityInfo.code}
                            </span>
                          </div>
                          <div className="time-center-box">
                            <div className="time">
                              <ClockCircleOutlined />
                              {flightDetail.duration.h}h&nbsp;
                              {flightDetail.duration.m}m
                            </div>
                            <div className="timeSplit">
                              <div className="stop-dot"></div>
                              <div className="stop-line"></div>
                              <div className="stop-dot"></div>
                            </div>
                            <span className="stop-text">
                              {flightDetail.flightSegments.length > 1
                                ? `${
                                    flightDetail.flightSegments.length - 1
                                  } ${t("stop")}`
                                : t("Direct")}
                            </span>
                            {/* <Button type="text">{flightSeg.airlineInfo.name}{flightSeg.flightNo}</Button> */}
                          </div>
                          <div className="time-right-box">
                            <span className="time">
                              {displayLocaleTime(
                                flightDetail.arriveDateTimeFormat,
                                EmomentFormatType.TIME
                              )}
                            </span>
                            <span className="code">
                              {
                                flightDetail.flightSegments[
                                  flightDetail.flightSegments.length - 1
                                ].aCityInfo.code
                              }
                            </span>
                          </div>
                        </div>
                        <div
                          className="f-info-stop"
                          onClick={() => {
                            showStopInfo(index);
                          }}
                        >
                          {/* <div
                              className="stop-code"
                            >
                              {flightDetail.flightSegments.map(
                                (flightSegment, index) => {
                                  return (
                                    <span className="code" key={index}>
                                      {
                                        flightSegment.dCityInfo
                                          .code
                                      }{" "}
                                      -
                                    </span>
                                  )
                                }
                              )}
                            </div> */}
                        </div>
                      </div>
                      <div className="right-box">
                        <div className="price-box">
                          <div className="total-price">
                            {/* <label>{t("total")}</label> */}
                            <span className="currency">{currency}</span>
                            <span className="price">
                              {flightPolicyDetailInfo.totalPrice}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          className="btn-select"
                          onClick={() => handleShowBookList(index)}
                        >
                          {t("Select")}
                          <DownOutlined />
                        </Button>
                      </div>
                    </div>
                    <CollapsePanel collapse={!collapseStatus[index]}>
                      <div className="result-wrapper">
                        <div
                          className="content"
                          onClick={() => {
                            showPolicyInfo(index);
                          }}
                        >
                          <PolicyTable
                            onSelect={() => {
                              handleBookClick(index);
                            }}
                            tableType={1}
                            policyInfo={flightPolicy}
                            policyDetailInfo={flightPolicyDetailInfo}
                            cabinType={searchFormAppData.cabinType}
                          ></PolicyTable>
                        </div>
                      </div>
                    </CollapsePanel>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightList;
