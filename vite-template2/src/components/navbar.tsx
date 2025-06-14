import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation(); // Get current location

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-white/90 shadow-md rounded-b-xl backdrop-blur-md py-2 px-6"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit flex items-center">
          {/* Replace with your logo if available */}
        </NavbarBrand>
        <div className="hidden lg:flex gap-6 justify-start ml-6">
          {siteConfig.navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "transition-colors duration-200 px-3 py-1 rounded-md text-lg font-medium hover:bg-primary/10 hover:text-primary",
                    isActive && "bg-primary/20 text-primary font-bold shadow-sm"
                  )}
                  color="foreground"
                  href={item.href}
                  data-active={isActive}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>
    </HeroUINavbar>
  );
};
