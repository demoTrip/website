import { useTranslation } from "react-i18next";
import { Button, Typography } from 'antd';
import classnames from "classnames";
import {Link} from "react-router-dom";
import './News.less';
const { Title, Paragraph } = Typography;

export function Healthy() {

    const { t } = useTranslation(); 

    const measuresList = [{
        img: 'HEPA',
        dt: t('m1-dt'),
        dd: t('m1-dd'),
        desc: t('m1-de')
    },{
        img: 'HandSanit',
        dt: t('m2-dt'),
        dd: t('m2-dd'),
        desc: t('m2-de')
    },{
        img: 'TempCheck',
        dt: t('m3-dt'),
        dd: t('m3-dd'),
        desc: t('m3-de')
    },{
        img: 'DeepClean',
        dt: t('m4-dt'),
        dd: t('m4-dd'),
        desc: t('m4-de')
    },{
        img: 'AirVentilation',
        dt: t('m5-dt'),
        dd: t('m5-dd'),
        desc: t('m5-de')
    },{
        img: 'SocialDis',
        dt: t('m6-dt'),
        dd: t('m6-dd'),
        desc: t('m6-de')
    },{
        img: 'InflightService',
        dt: t('m7-dt'),
        dd: t('m7-dd'),
        desc: t('m7-de')
    },{
        img: 'CateringSafe',
        dt: t('m8-dt'),
        dd: t('m8-dd'),
        desc: t('m8-de')
    },{
        img: 'HealthForm',
        dt: t('m9-dt'),
        dd: t('m9-dd'),
        desc: t('m9-de')
    }]

    return (
        <section className="news-page-wrapper healthy-page">
            <div className="news-content">
                <div className="measures-title">
                    <Link className="home" to="/">{t("Back")}</Link>
                    <span className="measures-logo"></span>
                    <span>{t("Measures taken by airlines and airports")}</span>
                </div>
                <div className="measures-content">
                    {
                        measuresList.map((item, index) => {
                            return (
                                <div className="measures-item" key={index}>
                                    <div className={`measures-item-img img-${item.img}`}></div>
                                    <div className="measures-item-title">
                                        <div className="measures-item-dt">{item.dt}</div>
                                        <div className="measures-item-dd">{item.dd}</div>
                                    </div>
                                    <div className="measures-item-span"></div>
                                    <div className="measures-item-desc">{item.desc}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default Healthy
