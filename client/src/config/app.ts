interface AppConfig {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfig = {
    name: "Rank Master",
    github: {
        title: "Rank Master",
        url: "https://github.com/lvnko/rank-master",
    },
    author: {
        name: "lvnko",
        url: "https://github.com/lvnko/",
    }
}