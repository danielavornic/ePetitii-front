import { axios } from "@/lib";

export const receivers = {
  getList: async () => {
    const { data } = await axios.get("/receivers");
    return data;
  },
};
