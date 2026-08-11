package com.busgo.dto;
import jakarta.validation.constraints.*;
public record RegisterRequest(@Email @NotBlank String email,@NotBlank @Size(min=6) String password,@NotBlank String name) {}
