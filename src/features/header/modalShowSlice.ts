import { EActionType } from "@pages/user/Interface";
import { createSlice } from "@reduxjs/toolkit";

export const initialState:{visible:boolean,type:EActionType} = {
  visible: false,
  type: EActionType.login,
};

export const modalShowSlice = createSlice({
  name: "modalShow",
  initialState,
  reducers: {
  setType: (state, action) => {
    state.type = action.payload;
  },
   showModal: (state) => {
      state.visible = true;
   },
    hideModal: (state) => {
      state.visible = false;
    }
  },
});

export const { setType, showModal, hideModal } = modalShowSlice.actions;

export default modalShowSlice.reducer;
