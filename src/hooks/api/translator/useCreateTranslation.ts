import { useMutation } from "@tanstack/react-query";
import createTranslation from "../../../api/translator/createTranslation";

const useCreateTranslation = () => {
  return useMutation({
    mutationFn: createTranslation
  });
};

export default useCreateTranslation;
