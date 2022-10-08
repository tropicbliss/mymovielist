import { CheckIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <Hero />
      <Features />
      <TechStack />
      <Team />
      <Stats />
    </div>
  );
}

function Hero() {
  return (
    <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">
            Welcome to the premier movie watcher&apos;s paradise
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Get the latest entertainment news and movie info straight from us!
        </p>
      </div>
    </main>
  );
}

function Features() {
  const features = [
    {
      name: "Invite team members",
      description:
        "You can manage phone, email and chat conversations all from a single mailbox.",
    },
    {
      name: "List view",
      description:
        "You can manage phone, email and chat conversations all from a single mailbox.",
    },
    {
      name: "Keyboard shortcuts",
      description:
        "You can manage phone, email and chat conversations all from a single mailbox.",
    },
    {
      name: "Calendars",
      description:
        "You can manage phone, email and chat conversations all from a single mailbox.",
    },
    {
      name: "Notifications",
      description:
        "Find what you need with advanced filters, bulk actions, and quick views.",
    },
    {
      name: "Boards",
      description:
        "Find what you need with advanced filters, bulk actions, and quick views.",
    },
    {
      name: "Reporting",
      description:
        "Find what you need with advanced filters, bulk actions, and quick views.",
    },
    {
      name: "Mobile app",
      description:
        "Find what you need with advanced filters, bulk actions, and quick views.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:py-24 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold text-indigo-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            All-in-one platform
          </p>
          <p className="mt-4 text-lg text-gray-500">
            Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
            Malesuada adipiscing sagittis vel nulla nec.
          </p>
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <dl className="space-y-10 sm:grid sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-4 sm:gap-x-6 sm:gap-y-10 sm:space-y-0 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <CheckIcon
                    className="absolute h-6 w-6 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="ml-9 text-lg font-medium leading-6 text-gray-900">
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

function Stats() {
  return (
    <div className="bg-gray-50 pt-12 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by dozens of movie watchers
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Repellendus repellat laudantium.
          </p>
        </div>
      </div>
      <div className="mt-10 bg-white pb-12 sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Hits
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                    69
                  </dd>
                </div>
                <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Users
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                    1,000,000
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                    Movies Ranked
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                    9,000
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechStack() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <p className="text-center text-lg font-semibold text-gray-600">
          Our tech stack
        </p>
        <div className="mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-8">
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <img
              className="max-h-12"
              src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
              alt="Workcation"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <img
              className="max-h-12"
              src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
              alt="Mirage"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <img
              className="max-h-12"
              src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
              alt="Tuple"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <img
              className="max-h-12"
              src="https://tailwindui.com/img/logos/laravel-logo-gray-400.svg"
              alt="Laravel"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <img
              className="max-h-12"
              src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
              alt="StaticKit"
            />
          </div>
          <div className="col-span-1 flex justify-center bg-gray-50 py-8 px-8">
            <img
              className="max-h-12"
              src="https://tailwindui.com/img/logos/statamic-logo-gray-400.svg"
              alt="Statamic"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Team() {
  const people = [
    {
      name: "Leslie Alexander",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    // More people...
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-5 sm:space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet our developers
            </h2>
            <p className="text-xl text-gray-500">
              We've worked tirelessly throughout the school semester to deliver
              you a world-class premium user experience.
            </p>
          </div>
          <div className="lg:col-span-2">
            <ul
              role="list"
              className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-8"
            >
              {people.map((person) => (
                <li key={person.name}>
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <img
                      className="h-16 w-16 rounded-full lg:h-20 lg:w-20"
                      src={person.imageUrl}
                      alt=""
                    />
                    <div className="space-y-1 text-lg font-medium leading-6">
                      <h3>{person.name}</h3>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
