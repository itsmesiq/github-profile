import type { GithubLanguages, GithubLanguageStat } from './types';

const TOP_LANGUAGES_LIMIT = 5;

export function formatGithubLanguages(languages: GithubLanguages): GithubLanguageStat[] {
    const totalBytes = Object.values(languages).reduce((total, bytes) => total + bytes, 0);

    if (totalBytes === 0) {
        return [];
    }

    return Object.entries(languages)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: Math.round((bytes / totalBytes) * 100),
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, TOP_LANGUAGES_LIMIT);
}
