export const ROLE_HOME = {
  admin: "/admin",
  manager: "/manager",
  cashier: "/pos",
};

export const getHomeByRole = (role) => {
  if (!role) return "/";
  console.log("from getHome BY Role",role)
  return `/${role}` || "/";
};

export const redirectAfterLogin = (user) => {
  if (!user) return "/";
  return ROLE_HOME[user.role] || "/";
};

export const hasPermission = (userRole, allowedRoles = []) => {
  if (!userRole) return false;

  return allowedRoles.includes(userRole);
};