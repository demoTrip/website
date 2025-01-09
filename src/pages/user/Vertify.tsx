import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "use-http";
import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import { useTranslation } from "react-i18next";
import { Button, Layout, message, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getURLParameters } from "@common/utils";
const { Title, Text } = Typography;

export const VertifyPage = () => {
    const location = useLocation()
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { post, response } = useFetch();
    const [result, setResult] = useState(false);
    const param = getURLParameters(location.search);
    useEffect(() => {
        async function fetchData() {
            // You can await here
            await post("/website/verify", {
                userGuid: param.userid
            });
            if (response.ok) {
                if (response.data.status) {
                    message.success(response.data.msg || 'Successfully logined');
                    setResult(true);
                }
            } else {
                setResult(false);
                message.error(t('Network Error'));
            }
        }
        fetchData();
    }, []);
    return (
        result ? <>
            <Layout className="main" style={{ display: 'flex' }}>
                <div style={{ marginTop: 40, marginBottom: 70, marginLeft: 50, marginRight: 50 }}>
                    <CheckCircleOutlined style={{ fontSize: 40, color: 'green' }} />
                    <Title level={1} >{t("Authentication successful, your mailbox has been activated")}</Title>
                    <Button onClick={() => { navigate('/') }} type="primary">{t('Return to home page')}</Button>
                </div>
            </Layout>
        </> : <Layout className="main" style={{ display: 'flex' }}>
            <div style={{ marginTop: 40, marginBottom: 70, marginLeft: 50, marginRight: 50 }}>
                <CloseCircleOutlined style={{ fontSize: 40, color: 'red' }} />
                <Title level={1} >{t("Activation failed for some reason, please try again")}</Title>
                <Button onClick={() => { navigate('/') }} type="primary">{t('Return to home page')}</Button>
            </div>
        </Layout>
    );
}

export default VertifyPage
