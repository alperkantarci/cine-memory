import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { GoArchive, GoSearch } from "react-icons/go";

export const Layout = () => {
  const menus = [
    {
      title: "My Memories",
      icon: <GoArchive></GoArchive>,
      link: "/",
    },
    {
      title: "Search Multi",
      icon: <GoSearch></GoSearch>,
      link: "search/multi",
    },
  ];
  return (
    <>
      <div className="flex flex-col md:flex-row bg-neutral-900 text-neutral-200">
        <div className="hidden whitespace-nowrap border-r border-neutral-800 flex-shrink-0 px-4 md:flex flex-col h-screen">
          <header className="text-xl  py-10 px-10 text-center">
            Cine Memory
          </header>

          <ul className=" mt-10">
            {menus.map((menu, index) => (
              <NavLink
                to={menu.link || ""}
                key={index}
                className={`cursor-pointer flex items-center py-3 gap-4 hover:bg-neutral-800 rounded-md px-4`}
              >
                <span className="text-xl">{menu.icon}</span>
                <span className="font-semibold">{menu.title}</span>
              </NavLink>
            ))}
          </ul>
        </div>

        <main className="w-full py-10 px-3 sm:px-8 md:px-20 overflow-auto h-[calc(100vh-4rem)] md:h-full">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>

        <div className="px-4 md:hidden h-16 w-full z-10 flex gap-2 bg-black/50 backdrop-blur-md py-1">
          {menus.map((menu, index) => (
            <NavLink
              to={menu.link || ""}
              key={index}
              className={`cursor-pointer flex items-center py-4 hover:bg-neutral-800 rounded-md px-6`}
            >
              <span className="text-2xl" title={menu.title}>
                {menu.icon}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};
