import { I18n } from ".";

export enum PetitionStatus {
  pending = "pending", // waiting for votes
  pending_review = "pending_review", // not public
  approved = "approved", // by admin
  rejected = "rejected", // by admi
  in_progress = "in_progress", // in case it is a project
  completed = "completed",
}

interface Initiator {
  name: string;
  surname: string;
  idnp: string;
  region: number;
  birthdate: string;
}

export interface Signer {
  name: string;
  surname: string;
  idnp: string;
  region: number;
  birthdate: string;
}

export interface Category {
  id: number;
  name: string;
  i18n: I18n;
}

export interface Petition {
  id: number;
  initiator: Initiator;
  name: string;
  date: string;
  currSigns: number;
  neededSigns: number;
  description: string;
  region: Category;
  receiver: Category;
  status: PetitionStatus;
  signers: Signer[];
  deadline: string;
  categories: Category[];
  locale?: string; //for translation
}

export interface PetitionCreate {
  initiator_idnp: string;
  name: string;
  description: string;
  receiver: number;
  region?: number;
  categories: number[];
}

export interface PetitionFormData extends PetitionCreate {
  isChecked: boolean;
  isConsented: boolean;
}
