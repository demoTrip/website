import i18n from "i18next";
export function Company() {
  if (i18n.language === "cn") {
    return (
      <section className="container">
        <p>
          demoTrip.com拥有强大而广泛的航线网络，覆盖了全球各大城市的各类机票。用户可以通过平台搜索、比较、预定航班，同时可以选择座位、订餐等多项服务，满足客户的个性化出行需求。同时，demoTrip.com有完善的安全措施，保障用户的个人信息和交易数据的安全。另外，demoTrip.com还拥有全天的英语及其他语言的客户服务。demoTrip.com致力于为客户提供更全面的服务，保障客户的旅行，满足客户的旅行需求。
        </p>

        <p>
          demoTrip.com秉持着“让买票更简单”的理念，为用户提供高品质的在线机票销售服务，为客户的出行提供便利，为旅游业和经济发展做出贡献。
        </p>
      </section>
    );
  } else if (i18n.language === "en") {
    return (
      <section className="container">
        <p>
          demoTrip.com is operated by Hong Kong BAIYU Group Ltd., an
          international brand under BAIYU, committed to providing customers with
          convenient, safe and efficient ticket purchase and management
          services.
        </p>

        <p>
          Hong Kong BAIYU Group Ltd. was established in 2019 and is
          headquartered in Hong Kong. BAIYU is a professional air passenger
          sales company integrating international air tickets, business travel
          services, and travel consultation. It is a first-class and
          second-class air transport agency company approved by the Civil
          Aviation Administration of China, and a member of the International
          Air Transport Association. BAIYU is committed to integrating global
          resources, and through wholesalers and OTA platforms for offline and
          online distribution, to provide consumers with a better travel
          experience.
        </p>

        <p>
          demoTrip.com has a strong and extensive route network, covering all
          kinds of air tickets in major cities around the world. Users can
          search, compare, and book flights through the platform. At the same
          time, they can choose seats, order meals and other services to meet
          customers' personalized travel needs. At the same time, demoTrip.com
          has comprehensive security measures to ensure the security of users'
          personal information and transaction data. In addition, demoTrip.com
          also has customer service in English and other languages ​​around the
          clock. demoTrip.com is committed to providing customers with more
          comprehensive services, ensuring customers' travel and meeting their
          travel needs.
        </p>

        <p>
          demoTrip.com adheres to the concept of "making buying tickets easier",
          provides users with high-quality online ticket sales services,
          provides convenience for customers' travel, and contributes to tourism
          and economic development.
        </p>
      </section>
    );
  } else {
    return (
      <section className="container">
        <p>
          demoTrip.com擁有強大而廣泛的航線網絡，覆蓋了全球各大城市的各類機票。用戶可以通過平台搜索、比較、預定航班，同時可以選擇座位、訂餐等多項服務，滿足客戶的個性化出行需求。同時，demoTrip.com有完善的安全措施，保障用戶的個人信息和交易數據的安全。另外，demoTrip.com還擁有全天的英語及其他語言的客戶服務。
          demoTrip.com致力於為客戶提供更全面的服務，保障客戶的旅行，滿足客戶的旅行需求。
        </p>

        <p>
          demoTrip.com秉持著“讓買票更簡單”的理念，為用戶提供高品質的在線機票銷售服務，為客戶的出行提供便利，為旅遊業和經濟發展做出貢獻。
        </p>
      </section>
    );
  }
}
