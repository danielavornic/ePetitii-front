import { axios } from "@/lib";
import { Petition, PetitionCreate } from "@/types";

export const petitions = {
  getList: async (params: {
    categories?: number[];
    region?: number;
    status?: string;
    search?: string;
    sort?: string;
  }): Promise<Petition[]> => {
    const { data } = await axios.get("/petitions", { params });
    return data;
  },

  getById: async (id: number): Promise<Petition> => {
    const { data } = await axios.get(`/petitions/${id}`);
    return data;
  },

  create: async (body: PetitionCreate) => {
    const { data } = await axios.post("/petitions/create", body);
    return data;
  },

  sign: async (id: number, body: { initatior_idnp: string }) => {
    const { data } = await axios.post(`/petitions/${id}/sign`, body);
    return data;
  },
};
