import { useTranslation } from "react-i18next";
import { Select } from "antd";
import regionData from "@data/city-airport.json";
import countryData from "@data/country-city.json";
import "./AddressSearch.less";
import { useEffect, useRef, useState } from "react";
// import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const { Option, OptGroup } = Select;

const hotCityCode = {
  Asia: ["HKG", "MFM", "TPE", "TYO", "OSA", "SHA", "SIN", "SZX"],
  Europe: ["LON", "PAR", "ROM", "FRA", "BER", "MAD", "BCN"],
  "North America": ["NYC", "SFO", "LAX", "YVR", "YTO"],
  Other: ["SYD", "MEL"],
};

export function AddressSearch(props: {
  onAddressChange: Function;
  value: string | undefined;
  type: string;
}) {
  const { t, i18n } = useTranslation();

  const [inputKey, setInputKey] = useState("");

  const [isSearch, setIsSearch] = useState(true);

  const [searchData, setSearchData] = useState<any[]>(regionData);

  const selectRef: any = useRef(null);

  const { onAddressChange, value, type } = props;
  // 表单的值改变,fromType: 0由select改变，1由input改变
  const handleChange = (value: string, fromType: number) => {
    if (fromType === 1) {
      value = value.toUpperCase();
      if (value.length !== 3) return;
    }
    onAddressChange(value, type);
  };
  //input框
  const handleSearch = (value: string) => {
    if (value) {
      setInputKey(value);
      setIsSearch(true);
    }
  };
  //失去焦点
  const handleBlur = () => {
    setIsSearch(false);
    if (inputKey) {
      handleChange(inputKey, 1);
    }
  };

  const handleFocus = () => {
    setIsSearch(false);
  };

  // 获取推荐城市
  const getHotCity = (code: string) => {
    const res = regionData.find((city) => city.Code === code);
    return res;
  };

  // 获取城市名称
  const getAirportName = (airport: any) => {
    switch (i18n.language) {
      case "en":
        return airport.EName;
      case "tc":
        return airport.NameTW;
      case "cn":
        return airport.Name;
      case "jp":
        return airport.NameJP;
    }
  };

  // 获取城市搜索名称
  const getAirportSearch = (airport: any) => {
    return (
      airport.EName +
      " " +
      airport.NameTW +
      " " +
      airport.Spell +
      " " +
      airport.Code +
      " " +
      airport.ShortSpell
    );
  };

  // 处理原始城市数据
  useEffect(() => {
    setSearchData(searchData.concat(countryData));
  }, []);

  const filterOption = (input: any, option: any): boolean => {
    return (
      option &&
      option.search &&
      option.search.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  // 自定义输入框

  return (
    <Select
      className="address-search-wrapper"
      value={value}
      placeholder={t("City or airport")}
      bordered={false}
      showSearch
      onChange={(value: any) => {
        handleChange(value, 0);
      }}
      onSearch={(value: any) => {
        handleSearch(value);
      }}
      onBlur={handleBlur}
      onFocus={handleFocus}
      optionFilterProp="search"
      filterOption={filterOption}
      optionLabelProp="showlabel"
      ref={selectRef}
    >
      {!isSearch &&
        Object.keys(hotCityCode).map((area, aindex) => {
          return (
            <OptGroup label={t(area)} key={aindex}>
              {hotCityCode[area].map((code: string, index: number) => {
                const val = getHotCity(code);
                if (!val) return null;
                return (
                  <Option
                    className="ctiy-name"
                    value={val.Code}
                    key={aindex * 100 + index}
                    showlabel={getAirportName(val) + " - " + t(" All Airport")}
                  >
                    {getAirportName(val)}
                  </Option>
                );
              })}
            </OptGroup>
          );
        })}
      {isSearch &&
        searchData.map((region, rindex) => {
          return (
            <OptGroup label={getAirportName(region)} key={rindex}>
              {region.Datas.length > 1 && !region.CountryCode && (
                <Option
                  className="ctiy-name"
                  value={region.Code || region.CountryCode}
                  key={rindex * 100}
                  search={getAirportSearch(region)}
                  label={
                    region.EName +
                    " " +
                    region.NameTW +
                    " " +
                    region.Code +
                    " " +
                    region.ShortSpell
                  }
                  showlabel={getAirportName(region) + " - " + t(" All Airport")}
                >
                  {getAirportName(region)}
                  {t(" All Airport")}
                </Option>
              )}
              {region.Datas.map((airport: any, aindex: number) => {
                return (
                  <Option
                    className="ctiy-name full-ctiy-name"
                    value={airport.Code}
                    key={rindex * 100 + 1 + aindex}
                    label={
                      airport.EName + " " + airport.NameTW + " " + airport.Code
                    }
                    search={
                      getAirportSearch(airport) + getAirportSearch(region)
                    }
                    showlabel={
                      getAirportName(region) +
                      " - " +
                      getAirportName(airport) +
                      "(" +
                      airport.Code +
                      ")"
                    }
                  >
                    {getAirportName(airport)} {airport.Code}
                  </Option>
                );
              })}
            </OptGroup>
          );
        })}
    </Select>
  );
}
