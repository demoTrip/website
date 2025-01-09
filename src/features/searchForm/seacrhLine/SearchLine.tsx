import { DatePicker } from "antd";
import { useEffect, useMemo, useState } from "react";
import { EFlightType, TTripSearch } from "..";
import { AddressSearch } from "../addressSearch/AddressSearch";
import update from "immutability-helper";
import "./SearchLine.less";
import moment from "moment";
import { EmomentFormatType } from "src/app/common";
import { getSearchForm, initialState } from "../searchFormSlice";
import { useAppSelector } from "src/app/hooks";

const { RangePicker } = DatePicker;

export default function SeacrhLine(props: {
  tripType?: EFlightType;
  index?: number;
  onTripSearchChange: Function;
}) {
  const { tripType, onTripSearchChange, index = 0 } = props;

  // 全局表单数据
  const searchFormAppData = useAppSelector(getSearchForm).tripSearch;

  const [tripSearchList, setTripSearchList] = useState<TTripSearch[]>(
    initialState.tripSearch
  );

  // 规范的moment时间，用于传入日期组件中
  const momentTime = useMemo(() => {
    return tripSearchList.map((ts) =>
      ts.departTime ? moment(ts.departTime) : null
    );
  }, [tripSearchList]);

  // 默认值
  useEffect(() => {
    let newList: TTripSearch[] = searchFormAppData.map((ele, index) => {
      return update(tripSearchList[index] || {}, {
        departTime: { $set: ele.departTime },
        depart: { $set: ele.depart },
        arrive: { $set: ele.arrive },
      });
    });
    setTripSearchList(newList);
  }, []);

  useEffect(() => {
    onTripSearchChange(index, tripSearchList);
  }, [tripSearchList]);

  useEffect(() => {
    if (tripType === EFlightType.Round) {
      if (tripSearchList.length === 1) {
        setTripSearchList(
          update(tripSearchList, {
            1: {
              $set: {
                depart: tripSearchList[0].arrive,
                arrive: tripSearchList[0].depart,
                departTime: tripSearchList[0].departTime,
              },
            },
          })
        );
      }
    }
    if (tripType === EFlightType.OneWay) {
      if (tripSearchList.length !== 1) {
        setTripSearchList(
          update(tripSearchList, { $splice: [[1, tripSearchList.length]] })
        );
      }
    }
  }, [tripType]);

  const onDatechange = (res: any) => {
    if (!res) return;
    setTripSearchList(
      update(tripSearchList, {
        0: {
          departTime: { $set: res.format(EmomentFormatType.Default) },
        },
      })
    );
  };

  const onRangDatechange = (res: any) => {
    if (!res || res.length !== 2) return;

    setTripSearchList(
      update(tripSearchList, {
        0: {
          departTime: { $set: res[0].format(EmomentFormatType.Default) },
        },
        1: {
          departTime: { $set: res[1].format(EmomentFormatType.Default) },
        },
      })
    );
  };

  const onAddressChange = (address: string, type: string) => {
    if (type === "depart") {
      if (tripType === EFlightType.Round) {
        setTripSearchList(
          update(tripSearchList, {
            1: {
              arrive: { $set: address },
            },
            0: {
              depart: { $set: address },
            },
          })
        );
      } else {
        setTripSearchList(
          update(tripSearchList, {
            0: {
              depart: { $set: address },
            },
          })
        );
      }
    } else {
      if (tripType === EFlightType.Round) {
        setTripSearchList(
          update(tripSearchList, {
            1: {
              depart: { $set: address },
            },
            0: {
              arrive: { $set: address },
            },
          })
        );
      } else {
        setTripSearchList(
          update(tripSearchList, {
            0: {
              arrive: { $set: address },
            },
          })
        );
      }
    }
  };

  const handleTripInvet = () => {
    let newList: TTripSearch[] = tripSearchList.map((ele, index) => {
      let depart = ele.depart;
      let arrive = ele.arrive;
      return update(tripSearchList[index], {
        depart: { $set: arrive },
        arrive: { $set: depart },
      });
    });
    setTripSearchList(newList);
  };

  // Can not select days before today and today
  const disabledDate = (current: any) => {
    return current && current < moment().endOf("day");
  };

  return (
    <div className="searchLine">
      <div className="select-wrapper">
        <AddressSearch
          onAddressChange={onAddressChange}
          type="depart"
          value={tripSearchList[0].depart}
        ></AddressSearch>
        <i className="icon-plane" onClick={handleTripInvet}></i>
        <AddressSearch
          onAddressChange={onAddressChange}
          type="arrive"
          value={tripSearchList[0].arrive}
        ></AddressSearch>
      </div>
      {tripType === EFlightType.OneWay && (
        <div className="date-pick-wrapper">
          <DatePicker
            onChange={onDatechange}
            disabledDate={disabledDate}
            bordered={false}
            value={momentTime[0]}
          />
        </div>
      )}
      {tripType === EFlightType.Round && (
        <div className="date-pick-wrapper">
          <RangePicker
            onChange={onRangDatechange}
            disabledDate={disabledDate}
            bordered={false}
            value={[momentTime[0], momentTime[1]]}
          />
        </div>
      )}
    </div>
  );
}
