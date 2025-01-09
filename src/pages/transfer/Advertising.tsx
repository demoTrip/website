import { useEffect, useMemo } from "react";
import useFetch from "use-http";
import "./Advertising.less";
import { displayLocaleTime } from "@common/utils";

export function Advertising() {
  const { post } = useFetch();

  const queryParams = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sku = new URLSearchParams(atob(urlParams.get("sku") || ""));
    return {
      departCity: sku.get("departCity"),
      arriveCity: sku.get("arriveCity"),
      departTime: displayLocaleTime(sku.get("departTime"), "YYYY/MM/DD"),
      returnTime: displayLocaleTime(sku.get("returnTime"), "YYYY/MM/DD"),
      tripType: sku.get("tripType"),
    };
  }, []);

  useEffect(() => {
    const getJumpUrl = async (urlParams: string) => {
      let jumpUrl = "/";
      try {
        const { content } = await post("/website/transfer", {
          queryStr: urlParams,
        });
        if (content) {
          jumpUrl = content;
        }
      } finally {
        setTimeout(() => {
          window.location.href = jumpUrl;
        }, 3000);
      }
    };
    getJumpUrl(window.location.search);
  }, []);

  return (
    <div id="waitingCheckoutApp" className="waiting-page">
      <div className="waiting-page__container">
        <div className="waiting-page__card">
          <div className="waiting-page__top-card">
            <div className="waiting-page__image waiting-page__image--flight"></div>
          </div>
          <div className="waiting-page__bottom-card">
            <div className="waiting-page__summary">
              <div className="waiting-page__summary--destination">
                {queryParams.departCity}&nbsp;-&nbsp;{queryParams.arriveCity}
                {/* TPE&nbsp;-&nbsp;ICN */}
              </div>
              {/* <div className="waiting-page__summary--text-labels">
                Taipei Taiwán Taoyuan International&nbsp;-&nbsp;Seoul Incheon
                International
              </div> */}
              <div className="waiting-page__summary--text-dates">
                {queryParams.tripType === "RT"
                  ? `${queryParams.departTime} - ${queryParams.returnTime}`
                  : queryParams.departTime}
              </div>
            </div>
          </div>
        </div>
        <div className="waiting-page__brand">
          <span className="waiting-page__logo brand-logo"></span>
        </div>
        <div className="waiting-page__bar">
          <div className="lmn-progress-bar-30s">
            <div className="lmn-progress-bar__line"></div>
          </div>
        </div>
        <div className="waiting-page__summary--description">
          Please bear with us! We're finalizing your trip details.
        </div>
      </div>
      <div className="waiting-page__advertising bnr-dfp">
        <div id="ad-dfp__waiting-page" className="bnr-dfp"></div>
      </div>
    </div>
  );
}

export default Advertising;
