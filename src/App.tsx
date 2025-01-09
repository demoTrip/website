import "./App.less";
import { Header } from "./features/header/Header";
import { Footer } from "./features/footer/Footer";
import { CachePolicies, Provider } from "use-http";
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { useMemo } from "react";
import { getRandomString, removeEmpty } from "@common/utils";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";
import zhHK from "antd/lib/locale/zh_HK";
import zhCN from "antd/lib/locale/zh_CN";
import jaJP from "antd/lib/locale/ja_JP";
import "moment/locale/zh-hk";
import { ELanguageType } from "@features/header";
import { getHeader } from "@features/header/headerSlice";

const Home = lazy(() => import("@pages/flight/Home"));
const FlightList = lazy(() => import("@pages/flightList/FlightList"));
const DetailPage = lazy(() => import("@pages/details/DetailPage"));
const DetailList = lazy(() => import("@pages/details/DetailList"));
const News = lazy(() => import("@pages/news/News"));
const Healthy = lazy(() => import("@pages/news/Healthy"));
const Payment = lazy(() => import("@pages/payment/Payment"));
const Book = lazy(() => import("@pages/book/Book"));
const VertifyPage = lazy(() => import("@pages/user/Vertify"));
const ResetPWDPage = lazy(() => import("@pages/user/Resetpwd"));
const PaymentSuccess = lazy(() => import("@pages/payment/success/Success"));
const TransferAD = lazy(() => import("@pages/transfer/Advertising"));

function App() {
  // fetch 公共header配置
  const { userInfo, ...headData } = useAppSelector(getHeader);
  const fecthOptions = useMemo(() => {
    // undefined在header中会被视为一个字符串，所以要过滤掉，否则失去意义
    const headers = removeEmpty({
      Accept: "application/json",
      Userid: userInfo.email,
      ...headData,
    })
    return {
      interceptors: {
        // every time we make an http request, this will run 1st before the request is made
        // url, path and route are supplied to the interceptor
        // request options can be modified and must be returned
        request: async ({ options }: any) => {
          options.headers.sessionId =
            new Date().getTime().toString() + getRandomString(10);
          return options;
        },
      },
      cachePolicy: CachePolicies.CACHE_AND_NETWORK,
      headers,
    };
  }, [userInfo, headData]);

  // antd 国际化
  const locale = useMemo(() => {
    switch (headData.locale) {
      case ELanguageType.TChinese:{
        return zhHK;
      }
      case ELanguageType.Chinese:{
        return zhCN;
      }
      case ELanguageType.Japanese:{
        return jaJP;
      }
      default:{
        return enUS;
      }
    }
  }, [headData.locale]);

  // fetch 地址
  const fetchUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.skywinghub.com"
      : "http://localhost:7001";
  // : "https://www.skywinghub.com"


  return (
    <Provider url={fetchUrl} options={fecthOptions}>
      <ConfigProvider locale={locale}>
        <div className="App">
          <Header />
          <div className="app-container">
            <Suspense
              fallback={
                <div className="global-loading">
                  <span></span>&nbsp;&nbsp;Loading Website...
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="news/:type" element={<News />} />
                <Route path="healthy" element={<Healthy />} />
                <Route path="book" element={<Book />} />
                <Route
                  path="flightlist"
                  element={<FlightList />}
                />
                <Route path="payment" element={<Payment />} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="payment/fail" element={<PaymentSuccess />} />
                <Route
                  path="/detaillist"
                  element={
                    // <RequireAuth>
                      <DetailList />
                    // </RequireAuth>
                  }
                />
                <Route
                  path="detailpage"
                  element={
                      <DetailPage />
                  }
                />
                <Route path="vertify" element={<VertifyPage />} />
                <Route path="updatepwd" element={<ResetPWDPage />} />
                <Route path="transferad" element={<TransferAD />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </ConfigProvider>
    </Provider>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const headData = useAppSelector(getHeader);

  if (!headData.userInfo.email) {
    // Redirect them to the /login page, but save the current location they were
    return <Navigate to="/login" />;
  }
  return children;
}

export default App;
