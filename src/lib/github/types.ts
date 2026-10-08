export interface GithubUser {
    login: string;
    name: string | null;
    public_repos: number;
}

export interface GithubRepository {
    name: string;
    full_name: string;
    fork: boolean;
    language: string | null;
}

export type GithubLanguages = Record<string, number>;

export interface GithubLanguageStat {
    name: string;
    bytes: number;
    percentage: number;
}

export interface GithubContributorWeek {
    w: number;
    a: number;
    d: number;
    c: number;
}

export interface GithubContributor {
    author: {
        login: string;
    } | null;
    total: number;
    weeks: GithubContributorWeek[];
}

export interface GithubSearchResult {
    total_count: number;
}
