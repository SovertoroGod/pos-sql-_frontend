import { useDispatch, useSelector } from "react-redux"
import { createBranch } from "../modules/branches/branchSlice";

const useBranchCreate = () => {
    const dispatch = useDispatch();
    const { isLoading, message } = useSelector((state) => state.branches);
    const handleCreate = (data) => {
        return dispatch(createBranch(data));
    }
    return { handleCreate, isLoading, message };
};
export default useBranchCreate;