import { type LucideIcon } from 'lucide-react'

export interface NavLink {
  title: string
  url: string
  icon?: LucideIcon
  badge?: string
}

export interface NavCollapsible {
  title: string
  icon?: LucideIcon
  badge?: string
  items: NavLink[]
}

export type NavItem = NavLink | NavCollapsible

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarData {
  user: {
    name: string
    email: string
    avatar: string
  }
  teams: {
    name: string
    logo: LucideIcon
    plan: string
  }[]
  navGroups: NavGroup[]
}
