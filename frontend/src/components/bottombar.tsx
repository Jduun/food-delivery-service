// import * as React from "react";
import { Heart, House, Search, ShoppingCart, UserRound } from "lucide-react";
import { useNavigate } from "react-router";

export default function BottomBar() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="md:hidden">
        <div className="h-12"></div>
        <div className="bg-card text-card-foreground fixed bottom-0 left-0 w-full rounded-t-xl border p-3 shadow">
          <div className="flex justify-center gap-10">
            <House
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
            <Search
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
            <ShoppingCart
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
            <Heart
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
            <UserRound
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
