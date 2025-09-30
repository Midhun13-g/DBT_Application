package com.example.project_backend.service;

import com.example.project_backend.entity.Event;
import com.example.project_backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setLocation(eventDetails.getLocation());
        event.setType(eventDetails.getType());
        event.setStatus(eventDetails.getStatus());
        event.setOrganizer(eventDetails.getOrganizer());
        event.setMaxParticipants(eventDetails.getMaxParticipants());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now());
    }

    public List<Event> getEventsByStatus(Event.EventStatus status) {
        return eventRepository.findByStatusOrderByEventDateAsc(status);
    }

    public List<Event> getEventsByType(Event.EventType type) {
        return eventRepository.findByTypeOrderByEventDateAsc(type);
    }

    public List<Event> searchEvents(String title) {
        return eventRepository.findByTitleContainingIgnoreCaseOrderByEventDateAsc(title);
    }
}