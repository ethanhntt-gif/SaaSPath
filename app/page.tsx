import { Hero } from "@/components/home/hero";
import { PopularWorkflows } from "@/components/home/popular-workflows";
import { BuildYourOwnPath } from "@/components/home/build-your-own-path";
import { DiscoverTools } from "@/components/home/discover-tools";
import { SubmitCta } from "@/components/home/submit-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularWorkflows />
      <BuildYourOwnPath />
      <DiscoverTools />
      <SubmitCta />
    </>
  );
}
