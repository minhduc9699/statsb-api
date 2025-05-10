const express = require('express');
const router = express.Router({ mergeParams: true });
const matchEventController = require('./matchEvent.controller');

// Routes for events within a match
router.get('/', matchEventController.getEventsByMatch);
router.post('/', matchEventController.createEvent);
router.put('/:eventId', matchEventController.updateEvent);
router.delete('/:eventId', matchEventController.deleteEvent);

module.exports = router;
