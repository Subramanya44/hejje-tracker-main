export class Profile {
  id: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  mobile: string;
  points: number;

  constructor(
    id: string,
    updated_at: string,
    username: string,
    full_name: string,
    avatar_url: string,
    role: UserRole,
    mobile: string,
    points: number
  ) {
    this.id = id;
    this.updated_at = updated_at;
    this.username = username;
    this.full_name = full_name;
    this.avatar_url = avatar_url;
    this.role = role;
    this.mobile = mobile;
    this.points = points;
  }
}

export enum UserRole {
  'NO_USER' = 'NO_USER',
  'PUBLIC_USER' = 'PUBLIC_USER',
  'DEPARTMENT_USER' = 'DEPARTMENT_USER',
  'DEPARTMENT_ADMIN' = 'DEPARTMENT_ADMIN',
  'SUPER_ADMIN' = 'SUPER_ADMIN'

}

export interface UserRoleLabels {
  PUBLIC_USER: string;
  DEPARTMENT_USER: string;
  DEPARTMENT_ADMIN: string;
}


export const UserRoleValue: UserRoleLabels = {
  'PUBLIC_USER': 'Public User',
  'DEPARTMENT_USER': 'Department User',
  'DEPARTMENT_ADMIN': 'Department Admin',
};

