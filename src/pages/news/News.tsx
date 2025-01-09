import { message, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DisclaimerContent } from './temp/disclaimer';
import { Company } from './temp/company';
import { PrivacyContent } from './temp/privacy';
import { TermsContent } from './temp/terms';

import './News.less';
const { Title, Paragraph } = Typography;

export function News() {

    const { t } = useTranslation();
    const params: any = useParams()

    return (
        <div className="news-page-wrapper">
            <div className="news-content">
                {
                    params.type === "Company" && (
                        <Typography>
                            <Title className='title'>{t('CompanyTitle')}</Title>
                            <Company></Company>
                        </Typography>
                    )
                }
                {
                    params.type === "Privacy" && (
                        <Typography>
                            <Title className='title'>{t('PrivacyTitle')}</Title>
                            <PrivacyContent></PrivacyContent>
                        </Typography>
                    )
                }
                {
                    params.type === "Terms" && (
                        <Typography>
                            <Title className='title'>{t('TermsTitle')}</Title>
                            <TermsContent></TermsContent>
                        </Typography>
                    )
                }
            </div>
        </div>
    );
}

export default News
