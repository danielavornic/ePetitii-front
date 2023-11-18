export interface User {
  name: string;
  surname: string;
  email?: string;
  idnp: string;
  region: 1;
  birthdate: string;
  isSubscribed?: boolean;
}
