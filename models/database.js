import { config } from '../config.js';
import Mongoose from 'mongoose';

let db;

export async function connectDB() {
    return Mongoose.connect(config.db.host);
}

export function useVirtualId(schema) {
    schema.virtual('id').get(function() {
        return this._id.toString();
    });
    schema.set('toJSON', {
        virtuals: true
    });
    schema.set('toObject', {
        virtuals: true
    });
    schema.set('id', false);
}

// export function getUsers() {
//     return db.collection('users');
// }
