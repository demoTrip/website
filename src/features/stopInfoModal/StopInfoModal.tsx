import { useTranslation } from "react-i18next";
import { Typography, Modal, Timeline, Space } from "antd";
import "./StopInfoModal.less";
import { FlightSegment } from "@mock/flightDetail";
import { ClockCircleOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { EmomentFormatType } from "src/app/common";
import { displayLocaleTime, getAirlineLogo, getnameByCompanyCode, getTerminalNameByCode } from "@common/utils";
const { Title, Text } = Typography;

export const StopInfoModal = (props: { flightData: FlightSegment[] }) => {
  const { flightData } = props;
  const { t } = useTranslation();

  return (
    <div className="modal-stopInfo-wrapper">
      {flightData.map((flight, index) => {
        const acode = getTerminalNameByCode(flight.aPortInfo.code)
        return (
          <div className="segment-box" key={index}>
            {flightData.length > 1 && <Title level={5}>{t("Segment No.") + (index + 1)}</Title>}
            <div className="flightInfo-box">
              <Text className="flightInfo"><img src={getAirlineLogo(flight)}/>{getnameByCompanyCode(flight.airlineInfo.name)}
              &emsp;{flight.airlineInfo.name}{flight.flightNo}</Text>
              <Text className="flightInfo"><UserOutlined />{t(flight.cabinClass)}</Text>
              <Text className="flightInfo craftInfo"><SendOutlined />{flight.craftInfo.name}</Text>
            </div>
            <Timeline mode="right">
              <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '12px', lineHeight: "18px" }} />} key={index * 3} label={displayLocaleTime(flight.dDateTime,EmomentFormatType.FULLTIME)}>
                <b>[{flight.dCityInfo.code}]</b>{`${getTerminalNameByCode(flight.dPortInfo.code)} ${flight.dPortInfo.terminal || ""}`}
              </Timeline.Item>
              <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '12px', lineHeight: "18px" }} />} key={index * 3 + 1} label={displayLocaleTime(flight.aDateTime,EmomentFormatType.FULLTIME)}>
                <b>[{flight.aCityInfo.code}]</b>{`${acode} ${flight.aPortInfo.terminal || ""}`}
              </Timeline.Item>
            </Timeline>
            {flight.transferDurationInfo && (
              <div className="stop-box">
                <Timeline mode="right">
                  <Timeline.Item
                    key={index * 6 + 2}
                    dot={<ClockCircleOutlined style={{ fontSize: '12px', color: "#e53939", lineHeight: "18px" }} />}
                    label={`${flight.transferDurationInfo.hour}h ${flight.transferDurationInfo.min}m`}
                  > {t("Transfer in")} <b>{acode}</b>
                  </Timeline.Item>
                </Timeline>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const useStopInfoModal = () => {
  const { t } = useTranslation();
  return (flightData: FlightSegment[]) => {
    Modal.info({
      title: t("Information"),
      okText: t("confirm"),
      width: 700,
      closable: true,
      content: <StopInfoModal flightData={flightData}></StopInfoModal>,
    });
  };
};
