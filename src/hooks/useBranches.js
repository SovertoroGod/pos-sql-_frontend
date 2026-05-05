import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllBranches } from "../modules/branches/branchSlice";

const useBranches = (filters) => {
    const dispatch = useDispatch();
    const { branches, metadata, isLoading } = useSelector(
        (state) => state.branches
    );

    useEffect(() => {
        dispatch(getAllBranches(filters));
    }, [dispatch, filters]);

    return { branches, metadata, isLoading };
};

export default useBranches;