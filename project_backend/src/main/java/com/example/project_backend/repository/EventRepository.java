package com.example.project_backend.repository;

import com.example.project_backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByStatusOrderByEventDateAsc(Event.EventStatus status);
    
    List<Event> findByTypeOrderByEventDateAsc(Event.EventType type);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :startDate AND e.eventDate <= :endDate ORDER BY e.eventDate ASC")
    List<Event> findEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :now ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(LocalDateTime now);
    
    List<Event> findByTitleContainingIgnoreCaseOrderByEventDateAsc(String title);
}