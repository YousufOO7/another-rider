import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  address: string | null;
  name: string | null;
  avatar: string | null; 
  phone: string | null; 
  customer_type: string | null; 
}

const initialState: UserState = {
  id: null,
  email: null,
  address: null,
  name: null,
  avatar: null,
  phone:  null,
  customer_type: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<UserState>) => {
      
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.name = action.payload.name;
      state.avatar=action.payload.avatar;
      state.phone=action.payload.phone;
      state.customer_type=action.payload.customer_type;
    },
    clearUser: (state: UserState) => {
      state.id = null;
      state.email = null;
      state.name = null;
      state.address = null;
      state.avatar=null;
      state.phone=null;
      state.customer_type=null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
