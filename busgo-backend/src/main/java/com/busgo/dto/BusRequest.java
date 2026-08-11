package com.busgo.dto;
import com.busgo.entity.BusType;
import jakarta.validation.constraints.*;
public record BusRequest(@NotBlank String busNumber,@NotBlank String operatorName,@Min(1) int totalSeats,@NotNull BusType busType) {}
