const userData = [
  {
    username: "admin_user",
    password: "pw1234",
    numberOfLogins: 0,
    role: "ADMIN" as const,
  },
  {
    username: "regular_user",
    password: "pw1234",
    numberOfLogins: 0,
    role: "USER" as const,
  },
  {
    username: "advocate_user",
    password: "pw1234",
    numberOfLogins: 0,
    role: "ADVOCATE" as const,
  },
  // Add a new user with username "James" for testing the ADVOCATE role
  {
    username: "James",
    password: "pw1234",
    numberOfLogins: 0,
    role: "ADVOCATE" as const,
  }
];

export { userData }; 