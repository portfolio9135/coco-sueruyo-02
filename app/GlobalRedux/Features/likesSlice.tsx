import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LIKESTATE {
  postLikes: Record<string, string[]>; // このオブジェクトのキーは投稿のIDで、値はいいねを押したユーザーのIDの配列
}

const initialState: LIKESTATE = {
  postLikes: {},
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId, userId } = action.payload;
      if (!state.postLikes[postId]) {
        // 投稿が初めていいねされる場合、新しい配列を作成
        state.postLikes[postId] = [userId];
      } else {
        // すでにいいねが存在する場合、ユーザー ID を追加
        if (!state.postLikes[postId].includes(userId)) {
          state.postLikes[postId].push(userId);
        }
      }
    },


    removeLike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>
    ) => {
      const { postId, userId } = action.payload;
      if (state.postLikes[postId]) {
        // すでにいいねが存在する場合、ユーザー ID を削除
        state.postLikes[postId] = state.postLikes[postId].filter(
          (id) => id !== userId
        );

        // もし配列が空になった場合、該当のpostIdのキーを削除
        if (state.postLikes[postId].length === 0) {
          delete state.postLikes[postId];
        }
      }
    },
  },
});

export const { addLike, removeLike } = likesSlice.actions;

export const selectPostLikes = (state: RootState) => state.likes.postLikes;

export default likesSlice.reducer;
