import { ProfileHero } from '@/components/widgets/profile-hero/ProfileHero';
import { getGithubProfileData } from '@/lib/github/data';

export default async function Home() {
    const githubData = await getGithubProfileData();

    console.log('GitHub Data: ', githubData);

    return (
        <main className="h-dvh w-dvw bg-background px-16 py-16">
            <ProfileHero />
        </main>
    );
}
