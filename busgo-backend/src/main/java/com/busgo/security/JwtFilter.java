package com.busgo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

  private final JwtService jwt;

  public JwtFilter(JwtService jwt) {
    this.jwt = jwt;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest req,
      HttpServletResponse res,
      FilterChain chain) throws ServletException, IOException {

    String authorization = req.getHeader("Authorization");

    if (authorization != null && authorization.startsWith("Bearer ")) {

      String token = authorization.substring(7);

      try {
        String email = jwt.email(token);

        var auth = new UsernamePasswordAuthenticationToken(
            email,
            null,
            List.of(
                new SimpleGrantedAuthority("ROLE_USER")));

        SecurityContextHolder
            .getContext()
            .setAuthentication(auth);

        System.out.println(
            "JWT authenticated user: " + email);

      } catch (Exception e) {

        System.out.println(
            "JWT authentication failed: "
                + e.getMessage());

        SecurityContextHolder.clearContext();
      }
    }

    chain.doFilter(req, res);
  }
}
