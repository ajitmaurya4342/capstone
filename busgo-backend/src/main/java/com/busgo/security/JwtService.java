package com.busgo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
  @Value("${app.jwt.secret}")
  private String secret;
  @Value("${app.jwt.expiration-ms}")
  private long expiration;

  private Key key() {
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generate(String email, boolean admin) {
    return Jwts.builder().subject(email).claim("admin", admin).issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expiration)).signWith(key()).compact();
  }

  public String email(String token) {
    return Jwts.parser().verifyWith((javax.crypto.SecretKey) key()).build().parseSignedClaims(token).getPayload()
        .getSubject();
  }
}
