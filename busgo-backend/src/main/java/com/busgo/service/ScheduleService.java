package com.busgo.service;

import com.busgo.dto.ScheduleRequest;
import com.busgo.entity.*;
import com.busgo.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class ScheduleService {
    private final ScheduleRepository repo;
    private final BusRepository buses;
    private final BookingRepository bookings;

    public ScheduleService(ScheduleRepository r, BusRepository b, BookingRepository bk) {
        repo = r;
        buses = b;
        bookings = bk;
    }

    public List<Schedule> search(String from, String to, LocalDate date) {
        return repo.search(from, to, date);
    }

    public List<Schedule> getSchedule() {
        return repo.findAll();
    }

    public List<String> seats(UUID id) {
        repo.findById(id).orElseThrow(() -> new NoSuchElementException("Schedule not found"));
        return bookings.bookedSeats(id);
    }

    public Schedule create(ScheduleRequest r) {
        Schedule s = new Schedule();
        return save(s, r);
    }

    public Schedule getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Schedule not found"));
    }

    public Schedule update(UUID id, ScheduleRequest r) {
        return save(repo.findById(id).orElseThrow(() -> new NoSuchElementException("Schedule not found")), r);
    }

    private Schedule save(Schedule s, ScheduleRequest r) {
        s.setBus(buses.findById(r.busId()).orElseThrow(() -> new NoSuchElementException("Bus not found")));
        s.setFromCity(r.fromCity());
        s.setToCity(r.toCity());
        s.setDepartureTime(r.departureTime());
        s.setArrivalTime(r.arrivalTime());
        s.setFare(r.fare());
        s.setJourneyDate(r.journeyDate());
        return repo.save(s);
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }
}
