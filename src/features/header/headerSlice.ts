import update from "immutability-helper";
import { createSlice } from "@reduxjs/toolkit";
import { ELanguageType, ECurrencyType, THeadType } from "./index";
import { RootState } from "../../app/store";
import moment from "moment";
import { loginUser } from "src/userCookie";
import { getRandomString } from "@common/utils";

let localHeadData = localStorage.getItem("llt-headData");
if (localHeadData) localHeadData = JSON.parse(localHeadData);

export const initialState: THeadType = (localHeadData as any) || {
  locale: ELanguageType.TChinese,
  currency: ECurrencyType.HKD,
  clientTime: moment().format(),
  sessionId: "",
  userInfo: {
    email: "",
    userName: "",
  }
};

export const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeader: (state, action) => {
      state = Object.assign(state, action.payload);
      // 持久化存储
      localStorage.setItem("llt-headData", JSON.stringify(state));
    },
  },
});

export const { setHeader } = headerSlice.actions;

export const getHeader = (state: RootState) => {
  return update(state.header, {
    clientTime: { $set: moment().format() },
    userInfo: {
      $set: { userName: loginUser().userName, email: loginUser().email },
    },
    sessionId: {
      $set: new Date().getTime().toString() + getRandomString(10),
    },
  });
};

export default headerSlice.reducer;
