import { useDispatch, useSelector } from "react-redux";
import { createIssueItem } from "../modules/issueItem/issueItemSlice";

const useCreateIssueItem = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.issueItem);

  const handleCreate = async (data) => {
    return dispatch(createIssueItem(data));
  };

  return { handleCreate, isLoading };
};

export default useCreateIssueItem;
