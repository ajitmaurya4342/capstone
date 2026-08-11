package com.busgo.controller;

import com.busgo.dto.BookingRequest;
import com.busgo.dto.BookingResponse;
import com.busgo.entity.Booking;
import com.busgo.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService service;

    public BookingController(BookingService s) {
        service = s;
    }

    @PostMapping
    public Booking create(@Valid @RequestBody BookingRequest r, Principal p) {
        return service.create(r, p.getName());
    }

    @GetMapping("/mine")
    public List<BookingResponse> mine(Principal p) {
        return service.mine(p.getName());
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancel(
            @PathVariable UUID id,
            Principal principal) {

        return service.cancel(id, principal.getName());
    }
}
