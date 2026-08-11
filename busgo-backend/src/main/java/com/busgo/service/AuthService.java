package com.busgo.service;
import com.busgo.dto.*;
import com.busgo.entity.User;
import com.busgo.repository.UserRepository;
import com.busgo.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository u,PasswordEncoder e,JwtService j){users=u;encoder=e;jwt=j;}
 public AuthResponse register(RegisterRequest r){
   if(users.findByEmail(r.email()).isPresent()) throw new IllegalArgumentException("Email already registered");
   User u=new User();u.setEmail(r.email().toLowerCase());u.setName(r.name());u.setPassword(encoder.encode(r.password()));u.setAdmin(false);users.save(u);
   return new AuthResponse(jwt.generate(u.getEmail(),false),u.getEmail(),u.getName(),false);
 }
 public AuthResponse login(LoginRequest r){
   User u=users.findByEmail(r.email().toLowerCase()).orElseThrow(()->new IllegalArgumentException("Invalid credentials"));
   if(!encoder.matches(r.password(),u.getPassword())) throw new IllegalArgumentException("Invalid credentials");
   return new AuthResponse(jwt.generate(u.getEmail(),u.isAdmin()),u.getEmail(),u.getName(),u.isAdmin());
 }
}
