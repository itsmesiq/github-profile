import { ProfileBanner } from '@/components/widgets/ProfileBanner';

export default function ExportProfileBanner() {
    return (
        <main className="min-h-screen w-full bg-[#08080b] p-8">
            <div id="profile-banner-export" className="w-full" style={{ width: '1536px' }}>
                <ProfileBanner />
            </div>
        </main>
    );
}
