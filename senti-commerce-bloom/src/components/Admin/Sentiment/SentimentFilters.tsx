
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/app/hooks';
import { setSentimentFilter, setSearchFilter, getFilteredReviews } from '@/features/admin/sentimentDashboardSlice';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const SentimentFilters = () => {
    const dispatch = useAppDispatch();
    
    const handleFilter = () => {
        dispatch(getFilteredReviews());
    };

    return (
        <div className="flex items-center space-x-4 mb-4">
            <Input 
                placeholder="Search reviews..." 
                className="max-w-sm"
                onChange={(e) => dispatch(setSearchFilter(e.target.value))}
            />
            <Select onValueChange={(value) => dispatch(setSentimentFilter(value))}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleFilter}>
                <Search className="mr-2 h-4 w-4"/>
                Apply Filters
            </Button>
        </div>
    );
};

export default SentimentFilters;
