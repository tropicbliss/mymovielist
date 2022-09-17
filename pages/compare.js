import { Fragment, useState } from "react";
import { CheckIcon, MinusIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utilities";

const compare = () => {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
      <h1 className="text-center mb-16 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
        Compare movies
      </h1>
      <div className="grid grid-cols-2 divide-x divide-gray-900">
        <div className="px-3">
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
              placeholder="Search for movies"
            />
          </div>
        </div>
        <div className="px-3">
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-cyber-purple focus:ring-cyber-purple text-sm sm:text-base"
              placeholder="Search for movies"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default compare;
