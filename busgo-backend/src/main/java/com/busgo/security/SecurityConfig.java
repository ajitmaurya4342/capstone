package com.busgo.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
public class SecurityConfig {

  private final JwtFilter jwt;

  public SecurityConfig(JwtFilter jwt) {
    this.jwt = jwt;
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .csrf(c -> c.disable())

        .cors(c -> {
        })

        .sessionManagement(s -> s.sessionCreationPolicy(
            SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(a -> a

            // ============================
            // PUBLIC APIs
            // ============================

            .requestMatchers(
                "/api/auth/**",
                "/h2-console/**")
            .permitAll()

            // Public schedule search
            .requestMatchers(
                "GET",
                "/api/schedules/cities",
                "/api/schedules/search")
            .permitAll()

            // Public schedule viewing
            .requestMatchers(
                "GET",
                "/api/schedules",
                "/api/schedules/*",
                "/api/schedules/*/seats")
            .permitAll()

            // ============================
            // ADMIN / AUTHENTICATED APIs
            // ============================

            .anyRequest().authenticated())

        .headers(h -> h.frameOptions(f -> f.sameOrigin()))

        .addFilterBefore(
            jwt,
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {

    var c = new CorsConfiguration();

    c.setAllowedOrigins(
        java.util.List.of(
            "http://localhost:5173"));

    c.setAllowedMethods(
        java.util.List.of("*"));

    c.setAllowedHeaders(
        java.util.List.of("*"));

    var source = new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration(
        "/**",
        c);

    return source;
  }
}