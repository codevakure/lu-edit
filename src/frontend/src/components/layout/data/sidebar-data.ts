import {
  Home,
  MessageSquare,
  Bot,
  Workflow,
  Settings,
  HelpCircle,
  Users,
  BarChart3,
  FileText,
  Zap,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'User',
    email: 'user@langflow.org',
    avatar: '/avatars/user.jpg',
  },
  teams: [
    {
      name: 'Langflow',
      logo: Command,
      plan: 'Open Source',
    },
    {
      name: 'DataStax',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Team Project',
      logo: AudioWaveform,
      plan: 'Pro',
    },
  ],
  navGroups: [
    {
      title: 'Platform',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: Home,
        },
        {
          title: 'Playground',
          url: '/chat',
          icon: MessageSquare,
        },
        {
          title: 'Components',
          url: '/agents',
          icon: Bot,
        },
        {
          title: 'Flows',
          url: '/flows',
          icon: Workflow,
        },
      ],
    },
    {
      title: 'Analytics',
      items: [
        {
          title: 'Performance',
          url: '/analytics',
          icon: BarChart3,
        },
        {
          title: 'Logs',
          url: '/logs',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'API Keys',
          url: '/api-keys',
          icon: Zap,
        },
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'General',
              url: '/settings',
              icon: Settings,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Users,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: MessageSquare,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
