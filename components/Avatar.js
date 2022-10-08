import Image from "next/image";

const Avatar = ({ profileURL, initials }) => {
  if (profileURL) {
    return (
      <Image
        layout="fixed"
        width="40px"
        height="40px"
        className="inline-block h-10 w-10 rounded-full"
        src={profileURL}
        alt="Profile of the user"
        referrerPolicy="no-referrer"
        priority
      />
    );
  } else if (initials) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
        <span className="font-medium leading-none text-white">{initials}</span>
      </span>
    );
  } else {
    return (
      <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
        <svg
          className="h-full w-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
    );
  }
};

export default Avatar;
