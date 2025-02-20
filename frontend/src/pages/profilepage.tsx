import { useEffect, useState } from "react";
import PageTemplate from "./pageTemplate";
import { Button } from "@/components/ui/button";
import { clear_token, getUserInfo } from "@/api/userRouter";
import { useNavigate } from "react-router";
import { UserResponse } from "@/@app_types/user.dto";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername("...");

    getUserInfo(() => {
      navigate("/login");
    }).then((rs) => {
      if (rs) {
        const user = rs.data as UserResponse;
        setUsername(user.username);
      }
    });
  }, []);

  return (
    <PageTemplate>
      <div className="p-4">Вас зовут {username}</div>
      <div className="p-4">
        <Button
          onClick={() => {
            clear_token();
            navigate("/login");
          }}
        >
          Я хочу выйти
        </Button>
      </div>
    </PageTemplate>
  );
}
