import { useQuery } from "@tanstack/react-query";
import getRadicals from "../../../api/kanji-builder/getRadicals";

const useGetRadicals = () => {
  return useQuery({
    queryKey: ["radicals"],
    queryFn: getRadicals,
  });
};

export default useGetRadicals;
