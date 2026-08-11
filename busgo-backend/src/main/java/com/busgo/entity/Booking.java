package com.busgo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity @Table(name="booking")
public class Booking {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(optional=false) @JoinColumn(name="user_id") private User user;
    @ManyToOne(optional=false) @JoinColumn(name="schedule_id") private Schedule schedule;
    @Column(nullable=false, precision=10, scale=2) private BigDecimal totalFare;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private BookingStatus status=BookingStatus.CONFIRMED;
    @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();

    @OneToMany(mappedBy="booking", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<BookingSeat> seats=new ArrayList<>();

    public UUID getId(){return id;} public void setId(UUID v){id=v;}
    public User getUser(){return user;} public void setUser(User v){user=v;}
    public Schedule getSchedule(){return schedule;} public void setSchedule(Schedule v){schedule=v;}
    public BigDecimal getTotalFare(){return totalFare;} public void setTotalFare(BigDecimal v){totalFare=v;}
    public BookingStatus getStatus(){return status;} public void setStatus(BookingStatus v){status=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
    public List<BookingSeat> getSeats(){return seats;} public void setSeats(List<BookingSeat> v){seats=v;}
}
