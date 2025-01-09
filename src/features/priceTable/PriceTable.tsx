import { useCurrencySymbol } from "@common/utils";
import { TPassenger } from "@features/searchForm";
import { PolicyDetailInfo, PriceInfoPayload } from "@mock/flightDetail";
import { useTranslation } from "react-i18next";
import "./PriceTable.less";
import { add } from "mathjs";

export const PriceTable = (props: {
  priceData?: PolicyDetailInfo;
  passengerList: TPassenger[];
}) => {
  const { priceData, passengerList } = props;
  const { t } = useTranslation();
  const currency = useCurrencySymbol();
  // 全局顶部数据

  const checkPrice = (
    price: null | undefined | PriceInfoPayload,
    count: number,
    name: string
  ) => {
    return (
      price &&
      count !== 0 && (
        <div className="price-box">
          <div className="price-item">
            <label>{name}</label>
            <span>
              {currency} {add(Number(price.salePrice), Number(price.tax))} x{" "}
              {count}
            </span>
          </div>
          <div className="price-item">
            <label>{t("Fare")}</label>
            <span>
              {currency} {price.salePrice} x {count}
            </span>
          </div>
          <div className="price-item">
            <label>{t("Taxes & fees")}</label>
            <span>
              {currency} {price.tax} x {count}
            </span>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="price-detail-info">
      <p className="title">{t("Price Details")}</p>
      <div className="passenger-item">
        <p className="name">{t("Passengers")}</p>
        {checkPrice(priceData?.adultPrice, passengerList[0].count, t("Adult"))}
        {checkPrice(priceData?.childPrice, passengerList[1].count, t("Child"))}
        {checkPrice(
          priceData?.infantPrice,
          passengerList[2].count,
          t("Infant")
        )}
      </div>
      <div className="total-price">
        <span>{t("Total")}</span>
        <span className="total">
          <span className="curreny">{currency}</span>
          {priceData?.totalPrice}
        </span>
      </div>
      <div className="extra-info"></div>
    </div>
  );
};
