import { useDispatch, useSelector } from "react-redux";
import { deleteBranch } from "../modules/branches/branchSlice";

const useDeleteBranch = () => {
    const dispatch = useDispatch();
    
    const {isLoading} = useSelector((state) => state.branches);

  const handleDelete = (id) => {
    return dispatch(deleteBranch(id));
  };

  return { handleDelete, isLoading };
};

export default useDeleteBranch;