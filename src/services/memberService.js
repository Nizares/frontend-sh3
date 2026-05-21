import api from "./api";

export const memberService = {
  register: (data) =>
    api.post("/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};