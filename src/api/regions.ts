import { axios } from "@/lib";

export const regions = {
  getList: async () => {
    const { data } = await axios.get("/location");
    return data;
  },
};
