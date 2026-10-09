'use cache';

import { formatGithubLanguages } from '@/lib/github/formatters';
import type { GithubProfileData } from '@/lib/github/types';

import { getGithubProfileStats } from './profileStats';

export async function getGithubProfileData(username: string): Promise<GithubProfileData> {
    const profileStats = await getGithubProfileStats(username);

    return {
        profile: profileStats.profile,
        languages: formatGithubLanguages(profileStats.languages),
        contributions: profileStats.contributions,
        pullRequests: profileStats.pullRequests,
        activeDays: profileStats.activeDays,
    };
}
