import { Bug } from "lucide-react";
import { useSearchParams } from "react-router";

export default function ErrorPage() {
  const [queryParams] = useSearchParams();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Bug className="size-40" />
      <div>Что-то пошло не так</div>
      {queryParams.get("info") && <div>{queryParams.get("info")}</div>}
    </div>
  );
}
