package com.busgo.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "booking_seat")
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    public UUID getId() {
        return id;
    }

    public void setId(UUID v) {
        id = v;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking v) {
        booking = v;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule v) {
        schedule = v;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String v) {
        seatNumber = v;
    }

}
