package com.busgo.dto;
import jakarta.validation.constraints.*;
import java.util.*;
public record BookingRequest(@NotNull UUID scheduleId,@NotEmpty @Size(max=4) List<@NotBlank String> seatNumbers) {}
