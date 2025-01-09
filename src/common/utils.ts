import { ECurrencyType } from "@features/header";
import flightIconData from "@mock/flightCompany.json";
import { getHeader } from "@features/header/headerSlice";
import { useAppSelector } from "src/app/hooks";
import i18n from "i18next";
import { FlightSegment } from "@mock/flightDetail";
import regionData from "@data/city-airport.json";
import moment from "moment";

export const useCurrencySymbol = (): ECurrencyType => {
  const { currency } = useAppSelector(getHeader);
  return ECurrencyType[currency];
};

export const getRandomString = (len: number) => {
  len = len || 32;
  let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
};

export const getCityNameByCityCode = (cityCode:string) => {
  if(!cityCode) return ''
  cityCode = cityCode.toUpperCase()
  const city = regionData.find(p => p.Code === cityCode || p.Datas.find(d => d.Code === cityCode))
  return i18n.language === "cn" ? city?.Name : i18n.language === "tc" ? city?.NameTW : city?.EName
}

export const getTerminalNameByCode = (cityCode:string) => {
  let city: any = {} 
  cityCode = cityCode.toUpperCase()
  regionData.forEach(r => {
    const res = r.Datas.find(d => d.Code === cityCode)
    if (res) {
      city = res
    }
  })
  return i18n.language === "cn" ? city?.Name : i18n.language === "tc" ? city?.NameTW : city?.EName
}

export  const getCityMultiName = (flightGroup: any, type?: number) => {
  const flightGroupLength = flightGroup?.flightSegments.length
  const departMultCityName = getCityNameByCityCode(flightGroup?.flightSegments[0].dCityInfo.code) || flightGroup.departMultCityName
  const arriveMultCityName = getCityNameByCityCode(flightGroup?.flightSegments[flightGroupLength-1].aCityInfo.code) || flightGroup.arriveMultCityName
  if (!type) {
    return departMultCityName + " - " + arriveMultCityName;
  } else if (type === 1) {
    return departMultCityName
  } else if (type === 2) {
    return arriveMultCityName
  }
}

export  const getAirLineByLocal = (tripSearch: any) => {
  const departMultCityName = getCityNameByCityCode(tripSearch[0].depart)
  const arriveMultCityName = getCityNameByCityCode(tripSearch[0].arrive)
  
  return departMultCityName + " - " + arriveMultCityName;
 
}


export const getnameByCompanyCode = (companyCode: string) => {
  const company = flightIconData.find(item => item.companyCode.toLowerCase() === companyCode.toLowerCase());
  if (!company) return companyCode
  let rawName = company.companyName
  if (i18n.language === "en") {
    rawName = company.companyEName
    if (rawName) {
      rawName = convertFirstLetterToUpperCase(rawName)
    }
  } else if (i18n.language === "cn") {
    rawName = company.companyCName
  }
  return rawName
}

export const getCityImageByCityCode = (companyCode: string, type?: number) => {
  return `http://demoTrip.com/static/image/city/${companyCode.toUpperCase()}_${type? '750_500' : '960_210' }.jpg`
}

export const getAirlineLogo = (flightSeg: FlightSegment) => {
  try {
    let logo = require(`../static/image/airlogo/${flightSeg.airlineInfo.name.toUpperCase()}.png`)
    return logo
  } catch (error) {
    return require("../static/image/home/trip.png")
  }
}

export const getURLParameters = (url: string): any =>
// @ts-ignore
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a: { [x: string]: any; }, v: string) => {
      (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1))
      return a
      }, {}
  );

export const convertFirstLetterToUpperCase = (str: string): string => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

export const checkSpecialText = (text: number | string, type: number, currency: string, locale: string) => {
  if (Number(text) === -1 || text === "NaN") {
    return type? i18n.t("policyInfo2") : i18n.t("policyInfo1")
  } else if (Number(text) === 0) {
    return i18n.t("policyFree")
  } else if (locale === 'tc' || locale === 'cn') {
    return currency + text + i18n.t("lowcost")
  } else {
    return i18n.t("lowcost") + currency + text
  }
};
  
export const inCurrency = (currency:string|null) => {
  const supportCurrencyList = [
    "HKD",
    "CNY",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "KRW",
    "AUD",
    "CAD",
    "SGD",
    "MYR",
    "THB",
    "RUB",
    "INR",
    "PHP",
    "IDR",
    "TWD",
    "AED",
    "NZD",
  ];

  const defaultCurrency = "USD";
  if(!currency) return defaultCurrency;

  if (supportCurrencyList.includes(currency)) {
    return currency;
  }
  return defaultCurrency;
};

export const inLanguage = (language:string|null) => {
  const supportLanguageList = ["en", "cn", "tc"];
  const defaultLanguage = "en";
  if(!language) return defaultLanguage;

  if (supportLanguageList.includes(language)) {
    return language;
  }
  return defaultLanguage;
};


/**
 * 删除对象中为空的属性
 * @returns 
 */
export const  removeEmpty = <T extends Record<string, any>>(obj: T):Partial<T> => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) delete obj[key];
  });
  return obj;
}
// 使用moment.js 直接格式化目标时区的时间
export const displayLocaleTime = (time?: string|null, format?: string) => {
  const timeInfo = moment.parseZone(time)
  return timeInfo.zone(timeInfo.format('Z')).format(format || 'YYYY-MM-DD HH:mm')
}