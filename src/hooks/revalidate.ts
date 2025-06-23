import { RoutesName } from "@/constants/RoutesName";

export function useRevalidate() {
  const revalidate = async (path: string = "/", tag: string = "*") => {
    await fetch(RoutesName.API_REVALIDATE, {
      headers: {
        api_key: process.env.NEXT_PUBLIC_API_KEY || "",
      },
      method: "POST",
      body: JSON.stringify({ path, tag }),
    });
  };

  return { revalidate };
}