import React, {
  useState,
  useEffect,
} from "react";
import {
  List,
  Layout,
  Menu,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  message,
  Tag,
} from "antd";

import {
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFetch from "use-http";
import "./DetailList.less";
import { TFlightDetailListType } from "@mock/flightDetail";
import { displayLocaleTime, getAirlineLogo, getCityNameByCityCode } from "@common/utils";

const { Title, Text } = Typography;
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

export function getStatus(status: number, t: any) {
  switch (status) {
    case 99:
      return t("Pending Payment");
    case 0:
      return t("Issuing");
    case 1:
      return t("Issuing Succeed");
    case 2:
      return t("Issuing Failed");
    case 10:
      return t("Changing");
    case 11:
      return t("Changing Succeed");
    case 12:
      return t("Changed Failed");
    case 20:
      return t("Refunding");
    case 21:
      return t("Refunding Succeed");
    case 22:
      return t("Refunding Failed");
    case 999:
      return t("Order Cancelled");
  }
}

export const DetailList = () => {
  const { post, response } = useFetch();
  const [detailData, setData] = useState<TFlightDetailListType[]>();
  const [statusTag, setTag] = useState<string>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleSubmit = async (orderId: string) => {
    navigate("/detailpage?orderid="+ orderId);
    // await post("/website/shopping", { submitData }); // will return just the user's name
    // const text = await response.text();
    // console.log(text);
  };
  const key = "updatable";
  useEffect(() => {
    async function fetchData() {
      // You can await here
      // await post("/website/orderlist", { tag: statusTag ? statusTag : "all" });
      const a = (await import("../../__MOCK__/DetailList")).detailListMock
      message.success({ content: t("Loaded!"), key, duration: 2 });
      // const text = await response.text();
      const text = JSON.stringify(a);
      setData((JSON.parse(text) as any).content as TFlightDetailListType[]);
    }
    message.loading({ content: t("Loading..."), key });
    fetchData();
  }, [statusTag]);

  const handleChangeOrder = async (orderId: string, changeType: number) => {
    await post("/website/orderchange", { orderId, changeType });
    message.success({ content: t("Loaded!"), key, duration: 2 });
    handleSubmit(orderId);
  };

  return (
    <>
      <Layout className="main">
        <Content className="list-content" style={{ padding: "0 50px" }}>
          <Layout className="list-wrapper" style={{ padding: "24px 0" }}>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%" }}
              >
                <SubMenu
                  key="sub1"
                  icon={<UserOutlined />}
                  title={t("My Bookings")}
                >
                  <Menu.Item key="1" onClick={() => setTag("all")}>
                    {t("All Orders")}
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => setTag("payment")}>
                    {t("Pending Payment")}
                  </Menu.Item>
                  <Menu.Item key="3" onClick={() => setTag("processing")}>
                    {t("Waiting To Travel")}
                  </Menu.Item>
                  <Menu.Item key="4" onClick={() => setTag("done")}>
                    {t("Completed")}
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Content
              style={{
                padding: "0 12px",
                paddingBottom: "8px",
                minHeight: 280,
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={detailData}
                split={false}
                renderItem={(item) => (
                  <>
                    <div className="list-detail">
                      <>
                        <Layout
                          style={{
                            textAlign: "left",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <Row align="middle">
                            <Col span={1}>
                              {
                                item.shoppingInfo && (
                                  <img
                                    className="airline-logo"
                                    src={getAirlineLogo(
                                      item.shoppingInfo.flightGroupInfoList[0]
                                        ?.flightSegments[0]
                                    )}
                                    alt=""
                                    style={styles.airlineLogo}
                                  ></img>
                                )
                              }
                              
                            </Col>
                            <Col
                              flex="flex"
                              span={12}
                              style={{ flexDirection: "row" }}
                            >
                              <span style={styles.itemTitle}>
                                {t("Booking No.")}:
                              </span>
                              <span style={styles.blueText}>
                                {item.orderId}
                              </span>
                            </Col>
                            <Col span={6}>
                              <span>
                                {t("Date")}:
                                {displayLocaleTime(item.clientTime,"YYYY-MM-DD")}
                              </span>
                            </Col>
                            <Col span={4}>
                              <span>
                                {t("Status")}: {getStatus(item.status, t)}
                              </span>
                            </Col>
                          </Row>
                        </Layout>
                        <Divider />
                        {item.shoppingInfo && item.shoppingInfo.flightGroupInfoList.map(
                          (segmentItem, index) => {
                            const flightGroupLength =
                              segmentItem?.flightSegments?.length;
                            const departMultCityName =
                              getCityNameByCityCode(
                                segmentItem?.flightSegments[0].dCityInfo.code
                              ) || segmentItem.departMultCityName;
                            const arriveMultCityName =
                              getCityNameByCityCode(
                                segmentItem?.flightSegments[
                                  flightGroupLength - 1
                                ].aCityInfo.code
                              ) || segmentItem.arriveMultCityName;

                            return (
                              <div key={index}>
                                <Layout
                                  style={{
                                    textAlign: "left",
                                    backgroundColor: "#ffffff",
                                  }}
                                >
                                  <Row>
                                    <Col span={1.5}>
                                      <div
                                        style={{
                                          marginTop: 3,
                                          textAlign: "left",
                                        }}
                                      >
                                        <Tag color="volcano">
                                          {item.shoppingInfo && item.shoppingInfo.flightGroupInfoList
                                            .length === 1
                                            ? t("One-way")
                                            : index === 0
                                            ? t(`Depart`)
                                            : t(`Return`)}
                                        </Tag>
                                      </div>
                                    </Col>
                                    <Col span={16}>
                                      <Title
                                        level={4}
                                      >{`${departMultCityName} —— ${arriveMultCityName}`}</Title>
                                    </Col>
                                    <Col span={6}>
                                      <span style={styles.totalPrice}>
                                        {index === 0
                                          ? `${t("Total Price")}: ${
                                              item.currency
                                            } ${
                                              item.shoppingInfo?item.shoppingInfo.policyDetailInfo
                                                .totalPrice:0
                                            }`
                                          : null}
                                      </span>
                                    </Col>
                                  </Row>
                                </Layout>
                                <Layout
                                  style={{
                                    textAlign: "left",
                                    backgroundColor: "#ffffff",
                                  }}
                                >
                                  <Row>
                                    <Col span={6}>
                                      <div>
                                        <Text type="secondary">{`${t(
                                          "flightNo"
                                        )}`}</Text>
                                      </div>
                                      <div>
                                        <Text
                                          strong={true}
                                        >{`${segmentItem?.flightSegments[0].airlineInfo.name}${segmentItem?.flightSegments[0].flightNo}`}</Text>
                                      </div>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={4}>
                                      <div>
                                        <Text type="secondary">
                                          {t("Departure time")}
                                        </Text>
                                      </div>
                                      <div>
                                        <Text strong={true}>{displayLocaleTime(
                                          segmentItem.departDateTimeFormat,
                                          "YYYY/MM/DD HH:MM"
                                        )}</Text>
                                      </div>
                                    </Col>
                                    <Col span={6}>
                                      <div>
                                        <Text type="secondary">
                                          {t("Arrival time")}
                                        </Text>
                                      </div>
                                      <div>
                                        <Text strong={true}>{`${displayLocaleTime(
                                          segmentItem.arriveDateTimeFormat,
                                          "YYYY/MM/DD HH:MM"
                                        )}`}</Text>
                                      </div>
                                    </Col>
                                    <Col span={6}>
                                      <div>
                                        <Text type="secondary">{}</Text>
                                      </div>
                                      <div>
                                        <Text strong={true}>{}</Text>
                                      </div>
                                    </Col>
                                    <Col span={1}></Col>
                                  </Row>
                                </Layout>
                              </div>
                            );
                          }
                        )}
                      </>
                      <div style={{ textAlign: "right" }}>
                        {item.status === 99 ? (
                          <Button
                            type="primary"
                            style={{ margin: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/payment", {
                                state: {
                                  shoppingId: item.shoppingInfo.shoppingId,
                                  orderId: item.orderId,
                                },
                              });
                            }}
                          >
                            {t("Check out")}
                          </Button>
                        ) : null}
                        {item.status in [0, 1, 2, 10, 11, 12] ? (
                          <Button
                            type="primary"
                            style={{ margin: 5 }}
                            onClick={() => {
                              handleChangeOrder(item.orderId, 20);
                            }}
                          >
                            {t("Refund")}
                          </Button>
                        ) : null}
                        {item.status == 1 ? (
                          <Button
                            type="primary"
                            style={{ margin: 5 }}
                            onClick={() => {
                              handleChangeOrder(item.orderId, 10);
                            }}
                          >
                            {t("Change")}
                          </Button>
                        ) : null}
                        {item.status == 99 ? (
                          <Button
                            type="primary"
                            style={{ margin: 5 }}
                            onClick={() => {
                              handleChangeOrder(item.orderId, 999);
                            }}
                          >
                            {t("Cancel Order")}
                          </Button>
                        ) : null}

                        <Button
                          type="primary"
                          style={{ margin: 5 }}
                          onClick={() => {
                            handleSubmit(item.orderId);
                          }}
                        >
                          {t("Order Details")}
                        </Button>
                      </div>
                    </div>
                    <div style={{ height: 10 }}></div>
                    <div></div>
                  </>
                )}
              />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  );
};
const styles = {
  airlineLogo: {
    width: 32,
    height: 32,
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 15,
  },
  changeButton: {
    textAlign: "right",
  },
  blueText: {
    color: "@primary-color",
  },
  totalPrice: {
    color: "@primary-color",
    fontWeight: "bold",
    fontSize: 18,
    TextDecoder: "underline",
  },
};

export default DetailList;
