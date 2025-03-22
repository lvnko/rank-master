import { Icons } from "@/components/icons"

interface NavItem {
    title: string
    tranlationkey?: string
    tranlationOptions?: Record<string, string>
    to?: string
    href?: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
}

export interface NavItemWithChildren extends NavItem {
    items?: NavItemWithChildren[]
}

export const mainMenu: NavItemWithChildren[] = [
    {
        title: 'Dashboard',
        tranlationkey: 'page.dashboard',
        tranlationOptions: { ns: 'common' },
        to: '/',
    },
    {
        title: 'Data',
        tranlationkey: 'page.data',
        tranlationOptions: { ns: 'common' },
        items: [
            {
                title: 'Users',
                tranlationkey: 'page.users',
                tranlationOptions: { ns: 'common' },
                to: '/users',
            },
            {
                title: 'Surveys',
                tranlationkey: 'page.surveys',
                tranlationOptions: { ns: 'common' },
                to: '/surveys',
            },
        ]
    }
]

export const sideMenu: NavItemWithChildren[] = []
