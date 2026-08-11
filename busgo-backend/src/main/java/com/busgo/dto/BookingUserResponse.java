package com.busgo.dto;

import com.busgo.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

public record BookingUserResponse(
        UUID id,
        String email,
        String name,
        LocalDateTime createdAt,
        boolean admin) {

    public static BookingUserResponse from(User user) {
        return new BookingUserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt(),
                user.isAdmin());
    }
}
