interface PetitionDetailProps {
  petition: Petition;
}

interface Petition {
  id: number;
  initiator: Person;
  region: string;
  name: string;
  date: string;
  currSigns: number;
  neededSigns: number;
  description: string;
  receiver: string;
  statut: "completed" | "pending" | "active"; // Adjust as per your actual status values
  signers: Person[];
  deadline: string;
  categories: Category[];
}

interface Person {
  name: string;
  surname: string;
  idnp: string;
  region: number;
  birthdate: string;
}

interface Category {
  id: number;
  name: string;
  i18n: {
    en: string;
    ro: string;
    ru: string;
  };
}

const samplePetition: Petition = {
  id: 123,
  initiator: {
    name: "Jane",
    surname: "Doe",
    idnp: "987654321",
    region: 1,
    birthdate: "1988-03-15",
  },
  region: "Northern",
  name: "Support for Young Technologists",
  date: "2023-05-19T00:00:00.000Z",
  currSigns: 5000,
  neededSigns: 5000,
  description:
    "We urge the government to provide financial support and resources for the development of young talent in the technology sector.",
  receiver: "Ministry of Technology",
  statut: "active",
  signers: [
    {
      name: "Robert",
      surname: "Brown",
      idnp: "123456789",
      region: 2,
      birthdate: "1991-08-25",
    },
    {
      name: "Emily",
      surname: "Johnson",
      idnp: "654321987",
      region: 3,
      birthdate: "1995-02-12",
    },
  ],
  deadline: "2023-07-31T00:00:00.000Z",
  categories: [
    {
      id: 1,
      name: "Education",
      i18n: {
        en: "Education",
        ro: "Educație",
        ru: "Образование",
      },
    },
    {
      id: 2,
      name: "Technology",
      i18n: {
        en: "Technology",
        ro: "Tehnologie",
        ru: "Технологии",
      },
    },
  ],
};

export { samplePetition };
