import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    query: { type: String, required: true },
    searchDate: { type: Date, default: Date.now },
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;
