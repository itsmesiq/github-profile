'use cache';

import { getGithubContributions } from '@/lib/github/contributions';
import { formatGithubLanguages } from '@/lib/github/formatters';
import { getGithubLanguages } from '@/lib/github/languages';
import { getGithubProfile } from '@/lib/github/profile';
import { getGithubPullRequests } from '@/lib/github/pullRequests';
import { getGithubRepositories } from '@/lib/github/repos';

export async function getGithubProfileData() {
    const [profile, repositories, pullRequests] = await Promise.all([
        getGithubProfile(),
        getGithubRepositories(),
        getGithubPullRequests(),
    ]);

    const [languages, contributions] = await Promise.all([
        getGithubLanguages(repositories),
        getGithubContributions(repositories),
    ]);

    return {
        profile,
        languages: formatGithubLanguages(languages),
        contributions,
        pullRequests,
    };
}
