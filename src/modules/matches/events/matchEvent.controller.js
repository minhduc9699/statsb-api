const MatchEvent = require('./matchEvent.model');

// Get all events for a match
exports.getEventsByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const events = await MatchEvent.find({ match: matchId })
      .populate('match')
      .populate('team')
      .populate('player')
      .populate('details.assistedPlayer')
      .populate('details.fouledPlayer')
      .populate('details.otherTeamPlayer');
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new MatchEvent(eventData);
    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = req.body;
    const updatedEvent = await MatchEvent.findByIdAndUpdate(eventId, eventData, { new: true })
      .populate('match')
      .populate('team')
      .populate('player')
      .populate('details.assistedPlayer')
      .populate('details.fouledPlayer')
      .populate('details.otherTeamPlayer');
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await MatchEvent.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(204).json();
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
