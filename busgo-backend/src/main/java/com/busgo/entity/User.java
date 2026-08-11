package com.busgo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false) private String password;
    @Column(nullable=false) private String name;
    @Column(name="is_admin", nullable=false) private boolean isAdmin;
    @Column(nullable=false) private LocalDateTime createdAt = LocalDateTime.now();

    public UUID getId(){return id;} public void setId(UUID id){this.id=id;}
    public String getEmail(){return email;} public void setEmail(String v){this.email=v;}
    public String getPassword(){return password;} public void setPassword(String v){this.password=v;}
    public String getName(){return name;} public void setName(String v){this.name=v;}
    public boolean isAdmin(){return isAdmin;} public void setAdmin(boolean v){this.isAdmin=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){this.createdAt=v;}
}
