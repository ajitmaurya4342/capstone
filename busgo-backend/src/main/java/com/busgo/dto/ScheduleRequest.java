package com.busgo.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.UUID;
public record ScheduleRequest(@NotNull UUID busId,@NotBlank String fromCity,@NotBlank String toCity,@NotNull LocalDateTime departureTime,@NotNull LocalDateTime arrivalTime,@NotNull @DecimalMin("0.0") BigDecimal fare,@NotNull LocalDate journeyDate) {}
