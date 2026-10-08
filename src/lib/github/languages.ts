import { githubFetch } from './client';
import type { GithubLanguages, GithubRepository } from './types';

const MAX_CONCURRENT_REQUESTS = 5;

async function getRepositoryLanguages(repository: GithubRepository): Promise<GithubLanguages> {
    return githubFetch<GithubLanguages>(`/repos/${repository.full_name}/languages`);
}

export async function getGithubLanguages(
    repositories: GithubRepository[],
): Promise<GithubLanguages> {
    const repositoriesToProcess = repositories.filter((repository) => !repository.fork);

    const languages: GithubLanguages = {};

    for (let i = 0; i < repositoriesToProcess.length; i += MAX_CONCURRENT_REQUESTS) {
        const batch = repositoriesToProcess.slice(i, i + MAX_CONCURRENT_REQUESTS);

        const results = await Promise.all(
            batch.map((repository) => getRepositoryLanguages(repository)),
        );

        for (const repositoryLanguages of results) {
            for (const [language, bytes] of Object.entries(repositoryLanguages)) {
                languages[language] = (languages[language] ?? 0) + bytes;
            }
        }
    }

    return languages;
}
