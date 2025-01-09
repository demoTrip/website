import { useCurrencySymbol, checkSpecialText } from "@common/utils";
import { ECabinType } from "@features/searchForm";
import { PolicyDetailInfo, PolicyInfo } from "@mock/flightDetail";
import { useTranslation } from "react-i18next";
import "./PolicyTable.less";
import { Table, Button } from "antd";
import { getHeader } from "@features/header/headerSlice";
import { useAppSelector } from "src/app/hooks";
import { useEffect, useState } from "react";
import {
  AccountBookOutlined,
  FileDoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import classnames from "classnames";

const { Column } = Table;

export const PolicyTable = (props: {
  policyInfo: PolicyInfo;
  policyDetailInfo: PolicyDetailInfo;
  tableType: number;
  cabinType: ECabinType;
  onSelect?: Function;
}) => {
  const { policyInfo, policyDetailInfo, onSelect, tableType, cabinType } =
    props;
  const { t } = useTranslation();
  const currency = useCurrencySymbol();
  const [policyData, setPolicyData] = useState([]);
  const headData = useAppSelector(getHeader);

  useEffect(() => {
    setPolicyData(formatTableData());
  }, [headData.locale, props]);

  const formatTableData = () => {
    let baggage = null;
    if (policyInfo.baggageInfoList[0].checkedFormatted) {
      baggage =
        policyInfo.baggageInfoList[0].checkedFormatted.adultDetail.piece +
        " x " +
        policyInfo.baggageInfoList[0].checkedFormatted.adultDetail.weight +
        " kg";
    }
    let cancellation = checkSpecialText(
      policyInfo.penaltyInfoList[0].cancelInfo.formatted.adultList[0]
        .specialText,
      0,
      currency,
      headData.locale
    );
    let changes = checkSpecialText(
      policyInfo.penaltyInfoList[0].changeInfo.formatted.adultList[0]
        .specialText,
      1,
      currency,
      headData.locale
    );
    const data: any = [
      {
        key: "1",
        class: t(
          cabinType === "E" ? "Economy/Premium Economy" : "Business/First"
        ),
        baggage: baggage ? baggage : t("No checked baggage allowance"),
        cancellation,
        changes,
        price: policyDetailInfo.avgPrice,
      },
    ];
    return data;
  };

  const handleSelect = (e: any) => {
    e.stopPropagation();
    onSelect && onSelect();
  };

  const getTwoToneColor = (value: string) => {
    return /\d+/g.test(value) || value === t("policyFree")
      ? "#931313"
      : "#d34b4b";
  };

  return (
    <div
      className={classnames("policy-detail-info", {
        book: !tableType,
      })}
    >
      <Table dataSource={policyData} pagination={false}>
        {tableType && (
          <Column
            title={t("Class")}
            dataIndex="class"
            key="class"
            render={(value: any) => (
              <p>
                <UserOutlined />
                {value}
              </p>
            )}
          />
        )}
        <Column
          title={t("Checked Baggage")}
          dataIndex="baggage"
          key="baggage"
          render={(value: any) => (
            <p>
              <AccountBookOutlined />
              {value}
            </p>
          )}
        />
        <Column
          title={t("Cancellations Fee")}
          dataIndex="cancellation"
          key="cancellation"
          render={(value: any) => (
            <p>
              <FileDoneOutlined style={{ color: getTwoToneColor(value) }} />
              {value}
            </p>
          )}
        />
        <Column
          title={t("Changes Fee")}
          dataIndex="changes"
          key="changes"
          render={(value: any) => (
            <p>
              <FileDoneOutlined style={{ color: getTwoToneColor(value) }} />
              {value}
            </p>
          )}
        />
        {tableType && (
          <Column
            title={t("Price Per Passenger")}
            dataIndex="price"
            key="price"
            className="td-price"
            render={(price: any) => (
              <div className="td-price-wrap">
                <p>
                  <span className="currency">{currency}</span>
                  {price}
                </p>
                <Button
                  type="primary"
                  className="btn-select"
                  onClick={handleSelect}
                >
                  {t("Book")}
                </Button>
              </div>
            )}
          />
        )}
      </Table>
    </div>
  );
};
