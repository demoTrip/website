import { useState, useMemo, useEffect } from "react";
import classnames from "classnames";
import "./SearchForm.less";
import { useTranslation } from "react-i18next";
import { Button, Select, message } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  ECabinType,
  EFlightType,
  EPassengerType,
  TFlightSearch,
  TPassenger,
  TTripSearch,
} from "./index";
import SearchLine from "./seacrhLine/SearchLine";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { setSearchForm, getSearchForm, initialState } from "./searchFormSlice";
import update from "immutability-helper";
import { useCommonHeaderData } from "@common/commonData";

const { Option } = Select;

export function SearchForm(props: any) {
  const { onSearchClick } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const maxPassengerNumber = 9;
  // 全局表单数据
  const searchFormAppData = useAppSelector(getSearchForm);
  // 全局顶部数据
  const headData = useCommonHeaderData();

  //设置行程类型
  const [tripType, setTripType] = useState(initialState.flightType);

  // 乘客数量
  const [passengerCount, setPassengerCount] = useState<TPassenger[]>(
    initialState.passenger
  );
  const [tripList, setTripList] = useState<TTripSearch[]>(
    initialState.tripSearch
  );
  // 舱位类型
  const [cabinType, setCabinType] = useState(initialState.cabinType);
  // 乘客名字
  const passengerName = useMemo(() => {
    return [t("Adult"), t("Children"), t("Infants")]
  },[headData.locale] )


  // 表单数据
  const searchFormData: TFlightSearch = useMemo(
    () => ({
      flightType: tripType,
      cabinType: cabinType,
      passenger: passengerCount,
      tripSearch: tripList,
    }),
    [tripType, passengerCount, tripList, cabinType]
  );

  // 乘客总数
  const totalPassenger = useMemo(() => {
    const count: number = passengerCount.reduce(
      (total, cur) => total + cur.count,
      0
    );
    const label: string = passengerCount.some(
      (val) => val.flag !== EPassengerType.adult && val.count > 0
    )
      ? t("passengers")
      : passengerCount[0].count > 1
      ? t("Adults")
      : t("Adult");

    return {
      count,
      label,
    };
  }, [passengerCount, headData.locale]);

  // 更新表单
  const updateFormData = (data: TFlightSearch) => {
    setTripType(data.flightType);
    setCabinType(data.cabinType);
    setPassengerCount(data.passenger);
    setTripList(data.tripSearch);
  }


  // 初次渲染时读取全局表单数据
  useEffect(() => {
    // console.log(tripList)
    if (searchFormAppData !== initialState) {
      updateFormData(searchFormAppData)
    }
  }, []);

  const onTripTypeChange = (value: EFlightType) => {
    setTripType(value);
  };

  const onCabinTypeChange = (value: ECabinType) => {
    setCabinType(value);
  };

  const handleStepperClick = (index: number, type: string) => {
    setPassengerCount(
      update(passengerCount, {
        [index]: {
          count: { $apply: (c) => (type === "minus" ? c - 1 : c + 1) },
        },
      })
    );
  };

  const onTripSearchChange = (index: number, value: TTripSearch[]) => {
    if (tripType !== EFlightType.Multi) {
      setTripList(value);
    } else {
      setTripList((preTripList: TTripSearch[]) => {
        return preTripList.map((oldValue, inx) => {
          return index === inx ? value[0] : oldValue;
        });
      });
    }
  };

  const handleSearhLineAdd = () => {
    if (tripList.length > 4) return;
    setTripList([...tripList, {} as any]);
  };

  const handleSearchClick = () => {
    // 全局表单数据设置
    // 判断数据是否完整
    const checkResult = checkSeacrhFormData(searchFormData);
    if (checkResult) return;
    dispatch(setSearchForm(searchFormData));
    // 触发点击回调
    onSearchClick(searchFormData);
  };

  const checkSeacrhFormData = (data: TFlightSearch) => {
    // 出发到达目的地检查
    const res = data.tripSearch.some((trip, index) => {
      if (!trip.arrive) {
        message.error(t("Please select the destination city or airport"));
        return true;
      }
      if (!trip.depart) {
        message.error(t("Please select the departure city or airport"));
        return true;
      }
      if (trip.depart === trip.arrive) {
        message.error(t("please select a different city or airport"));
        return true;
      }
      if (trip.departTime === "") {
        message.error(t("Please select the departure and arrival date"));
        return true;
      }
    });

    return res;
  };
  
  return (
    <div className="searchForm">
      <div className="topSelect">
        <Select onChange={onTripTypeChange} bordered={false} value={tripType} dropdownMatchSelectWidth={false}>
          <Option value={EFlightType.OneWay}>{t("One-way")}</Option>
          <Option value={EFlightType.Round}>{t("Round-trip")}</Option>
          {/* <Option value={EFlightType.Multi}>Multi-city</Option> */}
        </Select>
        <Select
          value={totalPassenger.count + " " + totalPassenger.label}
          bordered={false}
          dropdownMatchSelectWidth={false}
          dropdownClassName="stepper-drop-wrapper"
          dropdownRender={(menu) => (
            <div>
              {menu}
              <div className="stepper-wrapper">
                <p className="info">{t("info-1")}</p>
                {passengerCount.map((val, index) => {
                  return (
                    <div className="stepper-line" key={index}>
                      <label>{passengerName[index]}</label>
                      <div className="stepper-num-box">
                        <MinusCircleOutlined
                          className={classnames({
                            disable:
                              (index === 0 && passengerCount[0].count === 1) ||
                              val.count === 0,
                          })}
                          onClick={() => handleStepperClick(index, "minus")}
                        />
                        <p className="stepper-num">{val.count}</p>
                        <PlusCircleOutlined
                          className={classnames({
                            disable:
                              totalPassenger.count >= maxPassengerNumber ||
                              (index === 1 &&
                                val.count >= passengerCount[0].count * 2) ||
                              (index === 2 &&
                                val.count >= passengerCount[0].count),
                          })}
                          onClick={() => handleStepperClick(index, "plus")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        ></Select>
        <Select
          value={cabinType}
          onChange={onCabinTypeChange}
          dropdownMatchSelectWidth={false}
          bordered={false}
        >
          <Option value={ECabinType.EcoSuper}>{t("Economy/Premium Economy")}</Option>
          {/* <Option value={ECabinType.Super}>{t("Premium Economy")}</Option> */}
          <Option value={ECabinType.BusinessFirst}>{t("Business/First")}</Option>
          {/* <Option value={ECabinType.First}>{t("First")}</Option> */}
        </Select>
      </div>
      <div className="content">
        {(() => {
          switch (tripType) {
            case EFlightType.OneWay:
            case EFlightType.Round:
              return (
                <div className="single-wrapper">
                  <SearchLine
                    tripType={tripType}
                    onTripSearchChange={onTripSearchChange}
                  ></SearchLine>
                  <div className="btn-search" onClick={handleSearchClick}>
                    <i className="icon-search"></i>
                    <span>{t('Search')}</span>
                  </div>
                </div>
              );
            case EFlightType.Multi:
              return (
                <div className="single-wrapper mulit-select">
                  {tripList.map((tripData, index) => {
                    return (
                      <SearchLine
                        tripType={EFlightType.Round}
                        index={index}
                        key={index}
                        onTripSearchChange={onTripSearchChange}
                      ></SearchLine>
                    );
                  })}
                  <div className="btn-search" onClick={handleSearchClick}>
                    <i className="icon-search"></i>
                    <p>{t('search')}</p>
                  </div>
                  <Button
                    className="btn-add"
                    type="primary"
                    onClick={handleSearhLineAdd}
                    disabled={tripList.length > 4}
                  >
                    {t("addflight")}
                  </Button>
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
}
