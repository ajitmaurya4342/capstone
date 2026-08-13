package com.busgo.controller;

import com.busgo.dto.ScheduleRequest;
import com.busgo.entity.Schedule;
import com.busgo.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {
    private final ScheduleService service;

    public ScheduleController(ScheduleService s) {
        service = s;
    }

    @GetMapping
    public List<Schedule> getSchedules() {
        return service.getSchedule();
    }

    @GetMapping("/cities")
    public List<String> getCities() {
        return service.getCities();
    }

    @GetMapping("/search")
    public List<Schedule> search(@RequestParam String from, @RequestParam String to, @RequestParam LocalDate date) {
        return service.search(from, to, date);
    }

    @GetMapping("/{id}")
    public Schedule getSchedule(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/{id}/seats")
    public List<String> seats(@PathVariable UUID id) {
        return service.seats(id);
    }

    @PostMapping
    public Schedule create(@Valid @RequestBody ScheduleRequest r) {
        return service.create(r);
    }

    @PutMapping("/{id}")
    public Schedule update(@PathVariable UUID id, @Valid @RequestBody ScheduleRequest r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
