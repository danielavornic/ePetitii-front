import { axios } from "@/lib";

export const regions = {
  getList: async () => {
    const { data } = await axios.get("/regions");
    return data;
  },
};
