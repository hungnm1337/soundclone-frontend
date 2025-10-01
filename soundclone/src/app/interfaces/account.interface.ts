export interface AccountDTO {
  userId: number;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  dayOfBirth: string;
  bio?: string;
  profilePictureUrl?: string;
  createAt: string;
  updateAt: string;
  status: string;
  roleId: number;
  roleName: string;
}

export interface AccountListDTO {
  userId: number;
  name: string;
  email: string;
  username: string;
  status: string;
  roleName: string;
  createAt: string; // DateTime -> string
}

export interface AccountStatusUpdateDTO {
  userId: number;
  status: string; // "Active", "Blocked", "Suspended"
}

export interface RoleDTO {
  roleId: number;
  roleName: string;
  roleDescription: string;
}

export interface ChangeRoleDTO {
  roleId: number;
  userId: number;
}
