//

const simulatedDatabase = [
  {
    listId: 1,
    listName: "Nákupní seznam - Potraviny",
    items: [
      { name: "Banány", amount: 2, resolved: false },
      { name: "Cibule", amount: 3, resolved: true },
      { name: "Mléko", amount: 1, resolved: false },
    ],
    ownerID: 1,
    members: [
      { userId: 2, userName: "Matěj", role: "member" },
      { userId: 1, userName: "Anna", role: "member" },
    ],
  },
  {
    listId: 2,
    listName: "Nákupní seznam - Domácnost",
    items: [
      { name: "Mýdlo", amount: 1, resolved: true },
      { name: "Prací prášek", amount: 2, resolved: false },
    ],
    ownerID: 1,
    members: [
      { userId: 2, userName: "Matěj", role: "member" },
      { userId: 4, userName: "Eva", role: "member" },
    ],
  },
  {
    listId: 3,
    listName: "Nákupní seznam - Zahrada (zde je User Owner)",
    items: [
      { name: "Hrábě", amount: 1, resolved: false },
      { name: "Semena", amount: 5, resolved: true },
    ],
    ownerID: 2,
    members: [
      { userId: 3, userName: "Anna", role: "member" },
      { userId: 5, userName: "Karel", role: "member" },
    ],
  },
  {
    listId: 4,
    listName: "Nákupní seznam - Dovolená",
    items: [
      { name: "Sluneční brýle", amount: 1, resolved: false },
      { name: "Plavky", amount: 1, resolved: false },
    ],
    ownerID: 3,
    members: [
      { userId: 4, userName: "Eva", role: "member" },
      { userId: 5, userName: "Karel", role: "member" },
      { userId: 1, userName: "Petr", role: "owner" },
    ],
  },
  {
    listId: 5,
    listName: "Nákupní seznam - Opravy",
    items: [
      { name: "Šroubky", amount: 20, resolved: false },
      { name: "Kladivo", amount: 1, resolved: true },
      { name: "Barva", amount: 2, resolved: false },
    ],
    ownerID: 4,
    members: [
      { userId: 2, userName: "Matěj", role: "member" },
      { userId: 3, userName: "Anna", role: "member" },
    ],
  },
  {
    listId: 6,
    listName: "Nákupní seznam - Vánoce",
    items: [
      { name: "Cukr", amount: 2, resolved: false },
      { name: "Mouka", amount: 3, resolved: false },
      { name: "Ozdoby", amount: 1, resolved: true },
    ],
    ownerID: 1,
    members: [
      { userId: 2, userName: "Matěj", role: "member" },
      { userId: 4, userName: "Eva", role: "member" },
    ],
  },
];

export default simulatedDatabase;
