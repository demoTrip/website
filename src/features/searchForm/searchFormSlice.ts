import { createSlice } from "@reduxjs/toolkit";
import {
  ECabinType,
  EFlightType,
  EPassengerType,
  TFlightSearch,
} from "./index";
import { RootState } from "../../app/store";

let localSeacrhString = localStorage.getItem("llt-seacrhData")
let localSeacrhData: TFlightSearch =  localSeacrhString && JSON.parse(localSeacrhString)

export const initialState: TFlightSearch = {
  flightType: EFlightType.OneWay,
  cabinType: ECabinType.Economy,
  passenger: [
    {
      name: "Adult",
      count: 1,
      flag: EPassengerType.adult,
    },
    {
      name: "Children",
      count: 0,
      flag: EPassengerType.child,
    },
    {
      name: "Infants",
      count: 0,
      flag: EPassengerType.infant,
    },
  ],
  tripSearch: [
    {
      depart: undefined,
      arrive: undefined,
      departTime: "",
    },
  ],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'searchForm/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const searchFormSlice = createSlice({
  name: "searchForm",
  initialState: localSeacrhData || initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setSearchForm: (state: TFlightSearch, action) => {
      state = Object.assign(state, action.payload);
      // 持久化存储
      localStorage.setItem("llt-seacrhData", JSON.stringify(state));
    }
  },
});

export const { setSearchForm } = searchFormSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.searchForm.value)`
export const getSearchForm = (state: RootState) => state.searchForm;

export default searchFormSlice.reducer;
