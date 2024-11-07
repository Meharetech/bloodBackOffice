// event schema

const mongoose = require('mongoose')

const event = new mongoose.Schema({

    eventName: String,
    eventLocation: String,
    eventDate: Date,
    eventDescription: String,
    createdOn: {
        type: Date,
        default: Date.now,
    },
    deleteAt: {
        type: Date,
        default: function () {
            const eventDate = new Date(this.eventDate);
            // Set delete time to 11:55 PM of the same day as eventDate
            eventDate.setHours(23, 55, 0, 0);  // Set time to 11:55 PM
            return eventDate;
        },
    },
});

// TTL index on deleteAt field to delete document automatically
event.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

const Event = mongoose.model('Event', event);

module.exports = Event;