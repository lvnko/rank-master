import { Icons } from "@/components/icons"

interface NavItem {
    title: string
    to?: string
    href?: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
}

interface NavItemWithChildren extends NavItem {
    items?: NavItemWithChildren[]
}

export const mainMenu: NavItemWithChildren[] = [
    {
        title: 'Dashboard',
        to: '/',
    },
    {
        title: 'Data',
        items: [
            {
                title: 'Users',
                to: '/users',
            },
            {
                title: 'Surveys',
                to: '/surveys',
            },
        ]
    }
]

export const sideMenu: NavItemWithChildren[] = []
