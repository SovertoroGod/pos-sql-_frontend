import { useDispatch, useSelector } from "react-redux";
import { getBranchById } from "../modules/branches/branchSlice";
import { useEffect } from "react";

const useBranchDetail = (id) => {
    const dispatch = useDispatch();
    const { selectedBranch, isLoading } = useSelector((state) => state.branches)
    useEffect(() => {
        if (id) {
            dispatch(getBranchById(id));
        }
    }, [dispatch, id]);
    return {selectedBranch, isLoading};
}

export default useBranchDetail;