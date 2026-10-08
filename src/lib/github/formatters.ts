import type { GithubLanguages, GithubLanguageStat } from './types';

export function formatGithubLanguages(languages: GithubLanguages): GithubLanguageStat[] {
    const totalBytes = Object.values(languages).reduce((total, bytes) => total + bytes, 0);

    return Object.entries(languages)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: Math.round((bytes / totalBytes) * 100),
        }))
        .sort((a, b) => b.bytes - a.bytes);
}
