// 语言类型
export enum ELanguageType {
  English = "en",
  Spain = "es",
  Chinese = "cn",
  TChinese = "tc",
  Japanese = "jp",
}

// 语言选项
export type TLanguageType = {
  type: ELanguageType;
  name: string;
};

// 货币类型
export enum ECurrencyType {
  HKD = "HKD",
  CNY = "CNY",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  KRW = "KRW",
  AUD = "AUD",
  CAD = "CAD",
  SGD = "SGD",
  MYR = "MYR",
  THB = "THB",
  RUB = "RUB",
  INR = "INR",
  PHP = "PHP",
  IDR = "IDR",
  TWD = "TWD",
  AED = "AED",
  NZD = "NZD",
}

// 货币符号
export enum ECurrencySymbolType {
  HKD = "HK$",
  USD = "$",
  CNY = "CNY",
  EUR = "€",
}

// 公共参数
export type THeadType = {
  locale: ELanguageType; // 语言
  currency: ECurrencyType; // 货币
  clientTime: string; // 客户端时间
  sessionId: string;
  userInfo: {
    email: string;
    userName: string;
  };
};
