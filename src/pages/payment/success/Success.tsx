import { getURLParameters } from "@common/utils";
import { Button, Result } from "antd"
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.less"
import { onLogin } from "src/userCookie";

export function PaymentSuccess() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [userId, setUserId] = useState("")
    const [pageStatus, setPageStatus] = useState(1) // 1成功0失败
    const [pageMessage, setPageMessage] = useState("") // 1成功0失败
    const state: any = useRef(location.state)

    // 初次渲染
    useEffect(() => {
        if (location.pathname.indexOf("fail") >= 0) {
            setPageStatus(0)
        }
        if (location.search) {
            const param = getURLParameters(location.search)
            if (param) {
                setPageMessage(decodeURIComponent(param.res))
                setUserId(param.userId)
            }
        }
        // if (!state?.current) {
        //     navigate("/");
        // }
    }, []);

    useEffect(() => {
        if(userId){
            onLogin({
                email: userId,
                userName: userId,
                valid: false,
              });
        }
    }, [userId]);

    return (
        <div className="success-page-wrappr">
            <Result
                status={pageStatus? "success" : "error"}
                title={pageStatus? t("Payment succeeded!") : t("Payment failed!") }
                subTitle={pageStatus? (pageMessage + t(", Server takes 30-60 minutes, please wait.") ) : pageMessage }
                extra={[
                    <Button type="primary" key="console" onClick={(e) => {
                        navigate("/detaillist");
                    }}>
                        {t("Go My Orders")}
                    </Button>,
                ]}
            />
        </div>
    )
}

export default PaymentSuccess
