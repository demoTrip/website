import { useTranslation } from "react-i18next";
import { Typography, Timeline } from "antd";
import "./StopInfoTable.less";
import { FlightSegment } from "@mock/flightDetail";
import { ClockCircleOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { displayLocaleTime, getAirlineLogo, getnameByCompanyCode, getTerminalNameByCode } from "@common/utils";
const { Text } = Typography;

export const StopInfoTable = (props: { flightData: FlightSegment[] }) => {
  const { flightData } = props;
  const { t } = useTranslation();

  return (
    <div className="stopInfo-table">
      {flightData.map((flight, index) => {
        return (
          <div className="flightInfo" key={index}>
            <div className="top-airline-box">
              <img src={getAirlineLogo(flight)} />{getnameByCompanyCode(flight.airlineInfo.name)}
              &emsp;{flight.airlineInfo.name}{flight.flightNo}
            </div>
            <div className="bottom-stopInfo-box">
              <div className="left-box">
                <Timeline mode="left">
                  <Timeline.Item key={index * 3} label={displayLocaleTime(flight.dDateTime)}>
                    <b>[{flight.dCityInfo.code}]</b>{`${getTerminalNameByCode(flight.dPortInfo.code)} ${flight.dPortInfo.terminal || ""}`}
                  </Timeline.Item>
                  <Timeline.Item key={index * 3 + 1} label={displayLocaleTime(flight.aDateTime)}>
                    <b>[{flight.aCityInfo.code}]</b>{`${getTerminalNameByCode(flight.aPortInfo.code)} ${flight.aPortInfo.terminal || ""}`}
                  </Timeline.Item>
                </Timeline>
                {flight.stopInfoList?.length > 0 && (
                  <Timeline mode="right">
                    <Timeline.Item
                      key={index * 6 + 2}
                      dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
                      label={`${flight.stopInfoList[index].stopDurationInfo.hour}h ${flight.stopInfoList[index].stopDurationInfo.min}m`}
                    >{`${t("Transfer in")} ${flight.stopInfoList[index].stopCity.name
                      }`}
                    </Timeline.Item>
                  </Timeline>
                )}
              </div>
              <div className="right-box">
              <Text><UserOutlined />{t(flight.cabinClass)}</Text>
              <Text className="craftInfo"><SendOutlined />{flight.craftInfo.name}</Text>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
