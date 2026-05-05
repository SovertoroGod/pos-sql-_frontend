import { useDispatch, useSelector } from "react-redux";
import { updateBranch } from "../modules/branches/branchSlice"; 

const useUpdateBranch = () => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.branches);
    const handleUpdate = (id, data) => {
        return dispatch(updateBranch({ id, data }));
    }
    return {
        handleUpdate,
        isLoading
    }
}

export default useUpdateBranch;
