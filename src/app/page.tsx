import { ProfileHero } from '@/components/widgets/profile-hero/ProfileHero';
import { getGithubProfileData } from '@/lib/github/data';

const DEFAULT_GITHUB_USERNAME = 'itsmesiq';

interface HomeProps {
    searchParams: Promise<{
        username?: string;
    }>;
}

export default async function Home({ searchParams }: HomeProps) {
    const { username } = await searchParams;
    const githubUsername = username?.trim() || DEFAULT_GITHUB_USERNAME;

    const githubData = await getGithubProfileData(githubUsername);

    return (
        <main className="h-dvh w-dvw bg-background px-16 py-16">
            <ProfileHero data={githubData} />
        </main>
    );
}
