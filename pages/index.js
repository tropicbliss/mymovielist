import { CheckIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <Hero />
      <Features />
    </div>
  );
}

function Hero() {
  return (
    <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-cyber-purple sm:text-5xl md:text-6xl">
          <span className="block xl:inline">
            Welcome to the premier movie watcher&apos;s paradise
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-slime-green sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Get the latest entertainment news and movie info straight from us!
        </p>
      </div>
    </main>
  );
}

function Features() {
  const features = [
    {
      name: "Global Chat",
      description:
        "Provides a platform for movie lovers to get together to discuss their favourite movies.",
    },
    {
      name: "Latest entertainment news",
      description:
        "Keep track of what shenanigans your favourite internet celebrities have been up to lately.",
    },
    {
      name: "Track watch activity",
      description:
        "We help users keep track of their watched and unwatched movies.",
    },
    {
      name: "Ranking system",
      description:
        "There is no point trusting companies paid by Hollywood for their adulterated movie reviews (for legal reasons this is a joke).",
    },
    {
      name: "Movie repository",
      description:
        "Get the latest movie info and see how well they did in the box office so you can see film writers slowly fail upwards (ahem Morbius).",
    },
    {
      name: "Movie Comparisons",
      description:
        "Pit your favourite movies against each other to decide what movie to watch next (totally normal human behaviour btw, don't judge).",
    },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:py-24 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold text-cyber-purple">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slime-green">
            All-in-one platform
          </p>
          <p className="mt-4 text-lg text-gray-500">
            We help you organise your movie watching habits and share them for
            others to bully you.
          </p>
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <dl className="space-y-10 sm:grid sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:gap-x-6 sm:gap-y-10 sm:space-y-0 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <CheckIcon
                    className="absolute h-6 w-6 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="ml-9 text-lg font-medium leading-6 text-slime-green">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-9 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
