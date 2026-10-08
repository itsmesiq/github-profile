export interface GithubUser {
    login: string;
    name: string | null;
    public_repos: number;
}

export type GithubLanguages = Record<string, number>;

export interface GithubLanguageStat {
    name: string;
    bytes: number;
    percentage: number;
}

export interface GithubProfileData {
    profile: GithubUser;
    languages: GithubLanguageStat[];
    pullRequests: number;
    contributions: number;
    activeDays: number;
}
