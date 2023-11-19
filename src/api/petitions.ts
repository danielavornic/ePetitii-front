import { axios } from "@/lib";
import { Petition, PetitionCreate } from "@/types";

export const petitions = {
  getList: async (params?: {
    category_ids?: string;
    region?: number;
    status?: string;
    search?: string;
    sortBy?: string;
  }): Promise<Petition[]> => {
    const { data } = await axios.get("/petition", { params });
    return data;
  },

  getById: async (id: number, body: { locale: string }): Promise<Petition> => {
    const { data } = await axios.get(`/petition/${id}/translate`, { params: body });
    return data;
  },

  create: async (body: PetitionCreate) => {
    const { data } = await axios.post("/petition/create", body);
    return data;
  },

  sign: async (id: number, body: { user_idnp: string }) => {
    const { data } = await axios.post(`/petition/${id}/sign`, body);
    return data;
  },

  translate: async (id: number, body: { locale: string }) => {
    const { data } = await axios.get(`/petition/${id}/translate`, { params: body });
    return data;
  },

  delete: async (id: number) => {
    const { data } = await axios.delete(`petition/delete/${id}`);
    return data;
  },
};
