import { axios } from "@/lib";

export const categories = {
  getList: async () => {
    const { data } = await axios.get("/categories");
    return data;
  },
};
