package com.busgo.controller;

import com.busgo.dto.BusRequest;
import com.busgo.entity.Bus;
import com.busgo.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/buses")
public class BusController {
    private final BusService service;

    public BusController(BusService s) {
        service = s;
    }

    @GetMapping
    public List<Bus> all() {
        return service.all();
    }

    @PostMapping
    public ResponseEntity<Bus> create(@Valid @RequestBody BusRequest r) {
        return ResponseEntity.status(201).body(service.create(r));
    }

    @PutMapping("/{id}")
    public Bus update(@PathVariable UUID id, @Valid @RequestBody BusRequest r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
