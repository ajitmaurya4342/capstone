
package com.busgo.dto;

import com.busgo.entity.Booking;
import com.busgo.entity.BookingSeat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        BookingUserResponse user,
        BookingScheduleResponse schedule,
        BigDecimal totalFare,
        String status,
        LocalDateTime createdAt,
        List<String> seatNumbers) {

    public static BookingResponse from(Booking booking) {

        List<String> seatNumbers = booking.getSeats()
                .stream()
                .map(BookingSeat::getSeatNumber)
                .toList();

        return new BookingResponse(
                booking.getId(),
                BookingUserResponse.from(booking.getUser()),
                BookingScheduleResponse.from(booking.getSchedule()),
                booking.getTotalFare(),
                booking.getStatus().name(),
                booking.getCreatedAt(),
                seatNumbers);
    }
}
