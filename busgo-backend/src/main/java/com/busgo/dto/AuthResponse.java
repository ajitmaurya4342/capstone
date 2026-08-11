package com.busgo.dto;
public record AuthResponse(String token, String email, String name, boolean admin) {}
