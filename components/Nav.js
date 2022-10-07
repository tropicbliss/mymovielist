import { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon, FilmIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getID } from "../utilities";
import Router, { useRouter } from "next/router";
import Toast from "./Toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { classNames } from "../utilities";
import { LinearProgress } from "@mui/material";
import { GlobalContext } from "../context/GlobalState";
import Image from "next/image";

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

function signOut() {
  if (auth.currentUser) {
    auth.signOut();
  }
}

async function handleUserPortal() {
  if (auth.currentUser) {
    signOut();
  } else {
    await signInWithGoogle();
  }
}

const Nav = () => {
  const {
    load,
    setLoad,
    errorMsg,
    setErrorMsg,
    showToast,
    setToast,
    unknownError,
    errorTitle,
  } = useContext(GlobalContext);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const redirectToMoviePage = async (e) => {
    e.preventDefault();
    if (search === "") {
      setErrorMsg(
        "An error occured while searching",
        "You cannot enter an empty search term."
      );
      setToast(true);
      return;
    }
    setLoad(true);
    try {
      setSearch("");
      const id = await getID(search);
      if (id === null) {
        setErrorMsg(
          "An error occured while searching",
          "We were unable to find the movie you were looking for."
        );
        setToast(true);
        return;
      }
      router.push(`/moviedb/${id}`);
    } catch (e) {
      unknownError();
      console.log(e);
    } finally {
      setLoad(false);
    }
  };
  const [user] = useAuthState(auth);
  const defaultPhotoURL = "https://i.stack.imgur.com/34AD2.jpg";
  const photoURL = user
    ? user.photoURL
      ? user.photoURL
      : defaultPhotoURL
    : defaultPhotoURL;
  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setLoad(true);
    });
    Router.events.on("routeChangeComplete", () => {
      setLoad(false);
    });
    Router.events.on("routeChangeError", () => {
      setLoad(false);
    });

    return () => {
      Router.events.off("routeChangeStart", () => {
        setLoad(true);
      });
      Router.events.off("routeChangeComplete", () => {
        setLoad(false);
      });
      Router.events.off("routeChangeError", () => {
        setLoad(false);
      });
    };
  }, [Router.events]);

  return (
    <>
      <Toast
        show={showToast}
        setShow={setToast}
        isSuccess={false}
        title={errorTitle}
        description={errorMsg}
      />
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center px-2 lg:px-0">
                  <Link href="/">
                    <a className="flex-shrink-0 flex items-center space-x-3">
                      <FilmIcon
                        className="block h-8 w-auto text-cyber-purple lg:hidden"
                        aria-hidden="true"
                      />
                      <FilmIcon
                        className="hidden h-8 w-auto text-cyber-purple lg:block"
                        aria-hidden="true"
                      />
                    </a>
                  </Link>
                  <div className="hidden lg:ml-6 lg:block">
                    <div className="flex space-x-4">
                      <Link href="/news/1">
                        <a className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                          News
                        </a>
                      </Link>
                      <Link href="/compare">
                        <a className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                          Compare
                        </a>
                      </Link>
                      <a
                        href="#"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Global Rank
                      </a>
                      <Link href="/chat">
                        <a className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                          Global Chat
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="w-full max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <form onSubmit={redirectToMoviePage}>
                        <input
                          id="search"
                          name="search"
                          className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
                          placeholder="Search for movies"
                          type="search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </form>
                    </div>
                  </div>
                </div>
                <div className="flex lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-4 lg:block">
                  <div className="flex items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <Image
                            layout="fixed"
                            width="40px"
                            height="40px"
                            src={photoURL}
                            alt="Avatar of the user"
                            style={{ borderRadius: "50%" }}
                            referrerPolicy="no-referrer"
                            priority
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {user && (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/dashboard"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Dashboard
                                </a>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => handleUserPortal()}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                              >
                                {user ? "Sign Out" : "Sign In"}
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                <Disclosure.Button
                  as="a"
                  href="/news/1"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  News
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/compare"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Compare
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Global Rank
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/chat"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Global Chat
                </Disclosure.Button>
              </div>
              <div className="border-t border-gray-700 pt-4 pb-3">
                {user && (
                  <div className="mb-3 flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Image
                        layout="fixed"
                        width="40px"
                        height="40px"
                        src={photoURL}
                        alt="Avatar of the user"
                        style={{ borderRadius: "50%" }}
                        referrerPolicy="no-referrer"
                        priority
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user.displayName}
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-1 px-2">
                  {user && (
                    <Disclosure.Button
                      as="a"
                      href="/dashboard"
                      className="cursor-pointer block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Dashboard
                    </Disclosure.Button>
                  )}
                  <Disclosure.Button
                    as="a"
                    onClick={() => handleUserPortal()}
                    className="cursor-pointer block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {user ? "Sign Out" : "Sign In"}
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <LinearProgress color="success" className={load ? "" : "invisible"} />
    </>
  );
};

export default Nav;
