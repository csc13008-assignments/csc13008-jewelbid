import {
    HeroSection,
    TopDealsSection,
    RecommondedSection,
} from '@/modules/home';
import { getTopDealsData } from '@/lib/mockData';

export default function Home() {
    const topDealsData = getTopDealsData();

    return (
        <div className="min-h-screen">
            <HeroSection />
            <TopDealsSection auctions={topDealsData} />
            <RecommondedSection />
        </div>
    );
}
