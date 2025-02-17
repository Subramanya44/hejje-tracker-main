import { UserRole } from "../models/profile";

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  roles: UserRole[];
  children?: MenuItem[];  // Optional property
}