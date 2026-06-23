// app/sponsors/page.js
import Container from "@/src/components/Container";
import { SponsorList } from "../../components/SponsorList";

export default function SponsorsPage() {
  return (
    <Container className="flex flex-col gap-y-4 w-full">
      <div className="bg-gradient-to-t from-primary-light-active to-primary-light">
        <div className="mt-8 max-w-306 mx-auto">
          <div className="text-5xl font-bold font-young text-center">
            Sponsor Komunitas kami!
          </div>
          <SponsorList />
        </div>
      </div>
    </Container>
  );
}
