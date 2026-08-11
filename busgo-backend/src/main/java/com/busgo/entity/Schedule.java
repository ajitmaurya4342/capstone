package com.busgo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name="schedule")
public class Schedule {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(optional=false) @JoinColumn(name="bus_id") private Bus bus;
    @Column(nullable=false) private String fromCity;
    @Column(nullable=false) private String toCity;
    @Column(nullable=false) private LocalDateTime departureTime;
    @Column(nullable=false) private LocalDateTime arrivalTime;
    @Column(nullable=false, precision=10, scale=2) private BigDecimal fare;
    @Column(nullable=false) private LocalDate journeyDate;
    @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();

    public UUID getId(){return id;} public void setId(UUID v){id=v;}
    public Bus getBus(){return bus;} public void setBus(Bus v){bus=v;}
    public String getFromCity(){return fromCity;} public void setFromCity(String v){fromCity=v;}
    public String getToCity(){return toCity;} public void setToCity(String v){toCity=v;}
    public LocalDateTime getDepartureTime(){return departureTime;} public void setDepartureTime(LocalDateTime v){departureTime=v;}
    public LocalDateTime getArrivalTime(){return arrivalTime;} public void setArrivalTime(LocalDateTime v){arrivalTime=v;}
    public BigDecimal getFare(){return fare;} public void setFare(BigDecimal v){fare=v;}
    public LocalDate getJourneyDate(){return journeyDate;} public void setJourneyDate(LocalDate v){journeyDate=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}
