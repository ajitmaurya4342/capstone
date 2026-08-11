package com.busgo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name="bus")
public class Bus {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false, unique=true) private String busNumber;
    @Column(nullable=false) private String operatorName;
    @Column(nullable=false) private int totalSeats;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private BusType busType;
    @Column(nullable=false) private LocalDateTime createdAt=LocalDateTime.now();

    public UUID getId(){return id;} public void setId(UUID v){id=v;}
    public String getBusNumber(){return busNumber;} public void setBusNumber(String v){busNumber=v;}
    public String getOperatorName(){return operatorName;} public void setOperatorName(String v){operatorName=v;}
    public int getTotalSeats(){return totalSeats;} public void setTotalSeats(int v){totalSeats=v;}
    public BusType getBusType(){return busType;} public void setBusType(BusType v){busType=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}
