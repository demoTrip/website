import { useTranslation } from "react-i18next";
import { Typography, Space, Modal } from "antd";
import "./PolicyModal.less";
import {
  FlightGroupInfoList,
  PolicyInfo,
  TFlightDetailType,
} from "@mock/flightDetail";
import { EPassengerType } from "@features/searchForm";
import { store } from "src/app/store";
import { Provider } from "react-redux";
import { getCityNameByCityCode, useCurrencySymbol } from "@common/utils";
import { UserOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
export const PolicyModal = (props: {
  policyData: PolicyInfo;
  flightInfo: FlightGroupInfoList[];
}) => {
  const { policyData, flightInfo } = props;
  const { t } = useTranslation();
  const currency = useCurrencySymbol();

  const checkSpecialText = (text: string, type: number) => {
    return Number(text) === -1 || text === "NaN"
      ? type
        ? t("policyInfo2")
        : t("policyInfo1")
      : Number(text) === 0
      ? t("policyFree")
      : currency + text;
  };

  const getPoliciesTable = (
    passengerType: EPassengerType,
    showType: number = 0
  ) => {
    let typeObject = { name: "", key: "" };
    let suffixKey = showType ? "List" : "Detail";
    switch (passengerType) {
      case EPassengerType.adult:
        typeObject = { name: t("Adult Ticket"), key: `adult${suffixKey}` };
        break;
      case EPassengerType.child:
        typeObject = { name: t("Child Ticket"), key: `child${suffixKey}` };
        break;
      case EPassengerType.infant:
        typeObject = { name: t("Infant Ticket"), key: `infant${suffixKey}` };
        break;
      default:
        typeObject = { name: t("Adult Ticket"), key: `adult${suffixKey}` };
        break;
    }
    if (showType === 1) {
      return (
        <tbody>
          <tr>
            <th colSpan={3}>
              <UserOutlined /> {typeObject.name} ( {t("Price Per Passenger")})
            </th>
          </tr>
          <tr>
            <td className="label" rowSpan={2}>
              {t("Cancellations Fee")}
            </td>
            <td>{t("Before departure")}</td>
            <td>
              {checkSpecialText(
                policyData.penaltyInfoList[0].cancelInfo.formatted[
                  typeObject.key
                ][0].specialText,
                0
              )}
            </td>
          </tr>
          <tr>
            <td>{t("After departure")}</td>
            <td>
              {checkSpecialText(
                policyData.penaltyInfoList[0].cancelInfo.formatted[
                  typeObject.key
                ][1].specialText,
                0
              )}
            </td>
          </tr>
          {/* <tr>
            <td colSpan={2}>
              {
                policyData.penaltyInfoList[0].cancelInfo.formatted
                  .concurrentDescription
              }
            </td>
          </tr> */}
          <tr>
            <td className="label" rowSpan={2}>
              {t("Changes Fee")}
            </td>
            <td>{t("Before departure")}</td>
            <td>
              {checkSpecialText(
                policyData.penaltyInfoList[0].changeInfo.formatted[
                  typeObject.key
                ][0].specialText,
                1
              )}
            </td>
          </tr>
          <tr>
            <td>{t("After departure")}</td>
            <td>
              {checkSpecialText(
                policyData.penaltyInfoList[0].changeInfo.formatted[
                  typeObject.key
                ][1].specialText,
                1
              )}
            </td>
          </tr>
          {/* <tr>
            <td colSpan={2}>
              {
                policyData.penaltyInfoList[0].changeInfo.formatted
                  .concurrentDescription
              }
            </td>
          </tr> */}
        </tbody>
      );
    }
    const checkData = (() => {
      const data =
        policyData.baggageInfoList[0].checkedFormatted?.[typeObject.key];
      if (data && data.piece && data.weight) {
        return data;
      }
      return null;
    })();
    const handData = (() => {
      const data = policyData.baggageInfoList[0].handFormatted[typeObject.key];
      if (data && data.piece && data.weight) {
        return data;
      }
      return null;
    })();

    if (!checkData && !handData) {
      return null;
    }
    return (
      <tbody>
        <tr>
          {/* <th colSpan={2}>
                  {policyData.baggageInfoList[0].segmentList[0].dCityName}-
                  {policyData.baggageInfoList[0].segmentList[0].aCityName}
                </th> */}
        </tr>
        {checkData && (
          <tr>
            <td className="label" rowSpan={2}>
              {typeObject.name}
            </td>
            <td>
              <span>
                {t("Checked Baggage")}:&nbsp;
                {policyData.baggageInfoList[0].checkedFormatted[typeObject.key]
                  .piece +
                  t("(s) per person") +
                  ", " +
                  policyData.baggageInfoList[0].checkedFormatted[typeObject.key]
                    .weight +
                  t("kg each piece")}
              </span>
            </td>
          </tr>
        )}
        {handData && (
          <tr>
            <td>
              <span>
                {t("Carry-on Baggage")}:&nbsp;
                {policyData.baggageInfoList[0].handFormatted[typeObject.key]
                  .piece +
                  t("(s) per person") +
                  ", " +
                  policyData.baggageInfoList[0].handFormatted[typeObject.key]
                    .weight +
                  t("kg each piece")}
              </span>
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <div className="modal-policy-wrapper">
      <Space direction="vertical">
        <div className="box booking-box">
          <Title level={4}>{t("Booking Information")}</Title>
          <Space size={10}>
            {flightInfo.map((flight: FlightGroupInfoList, index: number) => {
              const flightGroupLength = flight.flightSegments.length;
              const departMultCityName =
                getCityNameByCityCode(
                  flight.flightSegments[0].dCityInfo.code
                ) || flight.departMultCityName;
              const arriveMultCityName =
                getCityNameByCityCode(
                  flight.flightSegments[flightGroupLength - 1].aCityInfo.code
                ) || flight.arriveMultCityName;
              return (
                <Text className="item" key={index}>
                  {departMultCityName + " - " + arriveMultCityName}
                </Text>
              );
            })}
          </Space>
        </div>
        <div className="box booking-box">
          <Title level={4}>{t("Baggage Allowance")}</Title>
          <table>{getPoliciesTable(EPassengerType.adult)}</table>
          <table>{getPoliciesTable(EPassengerType.child)}</table>
          <table>{getPoliciesTable(EPassengerType.infant)}</table>
        </div>
        <div className="box booking-box">
          <Title level={4}>{t("Cancellation And Change Policies")}</Title>
          <table>
            {getPoliciesTable(EPassengerType.adult, 1)}
            {getPoliciesTable(EPassengerType.child, 1)}
            {getPoliciesTable(EPassengerType.infant, 1)}
          </table>
        </div>
      </Space>
    </div>
  );
};

export const usePolicyModal = () => {
  const { t } = useTranslation();
  return (flightData: TFlightDetailType) => {
    Modal.info({
      title: t("Policies and Baggage Allowance"),
      okText: t("confirm"),
      width: 700,
      closable: true,
      content: (
        <Provider store={store}>
          <PolicyModal
            policyData={flightData.policyInfo}
            flightInfo={flightData.flightGroupInfoList}
          ></PolicyModal>
        </Provider>
      ),
    });
  };
};
