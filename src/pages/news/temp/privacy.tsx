import i18n from "i18next";
export function PrivacyContent() {
  if (i18n.language === "cn") {
    return (
      <section className="container">
        <p>test</p>
      </section>
    );
  } else if (i18n.language === "en") {
    return (
      <section className="container">
        <p>test</p>
      </section>
    );
  } else {
    return (
      <section className="container">
        <p>test</p>
      </section>
    );
  }
}
