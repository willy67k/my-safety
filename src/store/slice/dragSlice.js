import { createSlice } from "@reduxjs/toolkit";
import DragStatusEnum from "../../enum/dragStatus";

const initialState = {
  status: DragStatusEnum.normal,
  cardId: null,
  itemId: null,
};

export const dragSlice = createSlice({
  name: "drag",
  initialState,
  reducers: {
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setTargetItem: (state, { payload }) => {
      state.cardId = payload.id_group;
      state.itemId = payload.id;
    },
  },
});

export const { setStatus, setTargetItem } = dragSlice.actions;

export default dragSlice.reducer;
