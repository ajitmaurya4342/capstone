package com.busgo.service;
import com.busgo.dto.*; import com.busgo.entity.User; import com.busgo.repository.UserRepository; import com.busgo.security.JwtService; import org.junit.jupiter.api.*; import org.mockito.*; import org.springframework.security.crypto.password.PasswordEncoder; import java.util.*;
import static org.junit.jupiter.api.Assertions.*; import static org.mockito.Mockito.*;
class AuthServiceTest {
 @Mock UserRepository users; @Mock PasswordEncoder encoder; @Mock JwtService jwt; AuthService service;
 @BeforeEach void setUp(){MockitoAnnotations.openMocks(this);service=new AuthService(users,encoder,jwt);}
 @Test void registerCreatesUser(){when(users.findByEmail("a@b.com")).thenReturn(Optional.empty());when(encoder.encode("secret1")).thenReturn("hash");when(jwt.generate(anyString(),eq(false))).thenReturn("token");
  AuthResponse r=service.register(new RegisterRequest("a@b.com","secret1","A")); assertEquals("token",r.token());verify(users).save(any(User.class));}
 @Test void duplicateEmailFails(){when(users.findByEmail("a@b.com")).thenReturn(Optional.of(new User()));assertThrows(IllegalArgumentException.class,()->service.register(new RegisterRequest("a@b.com","secret1","A")));}
}
