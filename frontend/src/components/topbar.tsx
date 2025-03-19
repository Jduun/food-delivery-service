// import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, ShoppingCart, UserRound, Wheat } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import SearchBar from "@/components/searchbar";

export default function TopBar() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="menu">
        <div className="flex flex-row items-center gap-3 p-4 pb-0">
          <Link to={"/"}>
            <div className="flex flex-row items-center gap-2 text-2xl font-semibold">
              Продукты
              <Wheat className="mr-1 size-7" />
            </div>
          </Link>

          {/* <Input></Input> */}
          <SearchBar></SearchBar>
          <AccordionTrigger className="md:hidden"></AccordionTrigger>
          <div className="hidden md:block">
            <div className="flex flex-row">
              <Link to={"/orders"}>
                <div className="Профиль flex items-center space-x-2 p-4 text-base">
                  <Package id="delivery" className="size-6" />
                </div>
              </Link>

              {/* <Link to={"#"}>
                <div className="Профиль flex items-center space-x-2 p-4 text-base">
                  <Heart id="likes" className="size-6" />
                </div>
              </Link> */}

              <Link to={"/cart"}>
                <div className="Профиль flex items-center space-x-2 p-4 text-base">
                  <ShoppingCart id="cart" className="size-6" />
                </div>
              </Link>

              <Link to={"/profile"}>
                <div className="Профиль flex items-center space-x-2 p-4 text-base">
                  <UserRound id="profile" className="size-6" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <AccordionContent className="pb-0 md:hidden">
          <div className="flex flex-col">
            <Link to={"/orders"}>
              <div className="Профиль flex items-center space-x-2 p-4 text-base">
                <Package id="delivery" className="size-6" />
                <Label htmlFor="delivery" className="cursor-pointer text-lg">
                  Доставки
                </Label>
              </div>
            </Link>
            <Separator />
            {/* <Link to={"#"}>
              <div className="Профиль flex items-center space-x-2 p-4 text-base">
                <Heart id="likes" className="size-6" />
                <Label htmlFor="likes" className="cursor-pointer text-lg">
                  Лайки
                </Label>
              </div>
            </Link>
            <Separator /> */}
            <Link to={"/cart"}>
              <div className="Профиль flex items-center space-x-2 p-4 text-base">
                <ShoppingCart id="cart" className="size-6" />
                <Label htmlFor="cart" className="cursor-pointer text-lg">
                  Корзина
                </Label>
              </div>
            </Link>
            <Separator />
            <Link to={"/profile"}>
              <div className="Профиль flex items-center space-x-2 p-4 text-base">
                <UserRound id="profile" className="size-6" />
                <Label htmlFor="profile" className="cursor-pointer text-lg">
                  Профиль
                </Label>
              </div>
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
