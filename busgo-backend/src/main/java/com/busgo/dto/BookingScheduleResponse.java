package com.busgo.dto;

import com.busgo.entity.Schedule;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record BookingScheduleResponse(
        UUID id,
        Object bus,
        String fromCity,
        String toCity,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal fare,
        LocalDate journeyDate,
        LocalDateTime createdAt) {

    public static BookingScheduleResponse from(Schedule schedule) {
        return new BookingScheduleResponse(
                schedule.getId(),
                schedule.getBus(),
                schedule.getFromCity(),
                schedule.getToCity(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                schedule.getFare(),
                schedule.getJourneyDate(),
                schedule.getCreatedAt());
    }
}
