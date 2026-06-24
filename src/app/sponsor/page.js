// app/sponsors/page.js
import Container from "@/src/components/Container";
import { SponsorList } from "../../components/SponsorList";

export default function SponsorsPage() {
  return (
    <Container className="flex flex-col gap-y-4 w-full">
      <div className="bg-linear-to-br from-primary-light via-primary-light-active to-primary-light relative">
        <div
          className="absolute top-0 left-0 h-full w-28 bg-repeat-y bg-left mask-r-from-5%"
          style={{ backgroundImage: `url('/assets/images/batik4.svg')`, backgroundSize: '112px' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-28 bg-repeat-y bg-left -scale-x-100 mask-r-from-5%"
          style={{ backgroundImage: `url('/assets/images/batik4.svg')`, backgroundSize: '112px' }}
        />
        <div className="mt-8 max-w-306 mx-auto  relative">
          <div className="text-5xl font-bold font-young text-center">
            Sponsor Komunitas kami!
          </div>
          <SponsorList />
        </div>
      </div>
    </Container>
  );
}
