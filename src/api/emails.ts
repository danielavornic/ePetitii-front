import { axios } from "@/lib";

export const emails = {
  subscribe: async (body: { email: string; categories: number[] }) => {
    const { data } = await axios.post("/email/sendEmail", body);
    return data;
  },
};
