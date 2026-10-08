'use cache';

import { formatGithubLanguages } from '@/lib/github/formatters';
import { getGithubLanguages } from '@/lib/github/languages';
import { getGithubRepositories } from '@/lib/github/repos';
import type { GithubProfileData } from '@/lib/github/types';

import { getGithubProfileStats } from './profileStats';

export async function getGithubProfileData(): Promise<GithubProfileData> {
    const [profileStats, repositories] = await Promise.all([
        getGithubProfileStats(),
        getGithubRepositories(),
    ]);

    const languages = await getGithubLanguages(repositories);

    return {
        profile: profileStats.profile,
        languages: formatGithubLanguages(languages),
        contributions: profileStats.contributions,
        pullRequests: profileStats.pullRequests,
        activeDays: profileStats.activeDays,
    };
}
