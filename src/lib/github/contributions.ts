import { githubFetch } from '@/lib/github/client';
import type { GithubContributor, GithubRepository } from '@/lib/github/types';

const GITHUB_USERNAME = 'itsmesiq';
const MAX_CONCURRENT_REQUESTS = 5;

async function getRepositoryContributors(
    repository: GithubRepository,
): Promise<GithubContributor[]> {
    const result = await githubFetch<unknown>(`/repos/${repository.full_name}/stats/contributors`);

    if (!Array.isArray(result)) {
        return [];
    }

    return result as GithubContributor[];
}

export async function getGithubContributions(repositories: GithubRepository[]): Promise<number> {
    const repositoriesToProcess = repositories.filter((repository) => !repository.fork);

    let contributions = 0;

    for (let index = 0; index < repositoriesToProcess.length; index += MAX_CONCURRENT_REQUESTS) {
        const batch = repositoriesToProcess.slice(index, index + MAX_CONCURRENT_REQUESTS);

        const results = await Promise.all(
            batch.map((repository) => getRepositoryContributors(repository)),
        );

        for (const contributors of results) {
            const contributor = contributors.find((item) => item.author?.login === GITHUB_USERNAME);

            if (contributor) {
                contributions += contributor.total;
            }
        }
    }

    return contributions;
}
