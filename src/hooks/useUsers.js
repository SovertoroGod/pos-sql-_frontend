import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers, getUserById, setFilters } from "../modules/users/userSlice";

const useUsers = () => {
    const dispatch = useDispatch();
    const { users, metadata, filters, isLoading, selectedUser } = useSelector((state) => state.users);
    
    const [search, setSearch] = useState({
        full_name: "",
        username: "",
        email: "",
        role: ""
    });
    const [showFilters, setShowFilters] = useState(false);

    // Store previous search state to compare
    const [previousSearch, setPreviousSearch] = useState(search);

    // Fetch users when filters change
    useEffect(() => {
        dispatch(getAllUsers(filters));
    }, [dispatch, filters]);

    // Debounced search with smart comparison
    useEffect(() => {
        const delay = setTimeout(() => {
            // Check if search actually changed
            const searchChanged = JSON.stringify(search) !== JSON.stringify(previousSearch);
            
            if (searchChanged) {
                dispatch(setFilters({ ...search, page: 1 }));
                setPreviousSearch(search);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search, previousSearch, dispatch]);
    
    const handleSearch = (e) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        });
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const clearFilters = () => {
        setSearch({
            full_name: "",
            username: "",
            email: "",
            role: ""
        });
    };

    const updateFilters = (name, value) => {
        dispatch(setFilters({ [name]: value, page: 1 }));
    }

    const changePage = (page) => {
        dispatch(setFilters({ page }));
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-700 border-red-200',
            manager: 'bg-purple-100 text-purple-700 border-purple-200',
            cashier: 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const hasActiveFilters = Object.values(search).some(value => value.trim() !== '');

    return {
        // Data
        users,
        metadata,
        filters,
        isLoading,
        
        // Search state
        search,
        showFilters,
        hasActiveFilters,
        
        // Actions
        handleSearch,
        changePage,
        toggleFilters,
        clearFilters,
        updateFilters,
        
        // Utilities
        getRoleBadgeColor,
    };
};

export default useUsers;