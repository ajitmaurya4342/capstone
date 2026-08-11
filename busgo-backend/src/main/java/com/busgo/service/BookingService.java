package com.busgo.service;

import com.busgo.dto.BookingRequest;
import com.busgo.dto.BookingResponse;
import com.busgo.entity.*;
import com.busgo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {
  private final BookingRepository bookings;
  private final ScheduleRepository schedules;
  private final UserRepository users;

  public BookingService(BookingRepository b, ScheduleRepository s, UserRepository u) {
    bookings = b;
    schedules = s;
    users = u;
  }

  @Transactional
  public Booking create(BookingRequest r, String email) {
    User user = users.findByEmail(email).orElseThrow(() -> new NoSuchElementException("User not found"));
    Schedule s = schedules.findById(r.scheduleId()).orElseThrow(() -> new NoSuchElementException("Schedule not found"));
    var requested = new HashSet<>(r.seatNumbers());
    System.out.println("bookingSeat.seatNumber = " + requested);
    if (requested.size() != r.seatNumbers().size())
      throw new IllegalArgumentException("Duplicate seats");
    if (requested.stream().anyMatch(x -> !x.matches("^[1-9][0-9]?[A-D]$")))
      throw new IllegalArgumentException("Invalid seat number");
    var booked = new HashSet<>(bookings.bookedSeats(s.getId()));
    System.out.println("bookingSeat.seatNumber = " + booked);

    if (requested.stream().anyMatch(booked::contains))
      throw new IllegalArgumentException("One or more seats already booked");
    if (requested.size() > 4)
      throw new IllegalArgumentException("Maximum 4 seats");
    Booking b = new Booking();
    b.setUser(user);
    b.setSchedule(s);
    b.setTotalFare(s.getFare().multiply(BigDecimal.valueOf(requested.size())));
    for (String seat : r.seatNumbers()) {
      BookingSeat bs = new BookingSeat();
      bs.setBooking(b);
      bs.setSchedule(s);
      bs.setSeatNumber(seat);
      b.getSeats().add(bs);
    }
    return bookings.save(b);
  }

  @Transactional(readOnly = true)
  public List<BookingResponse> mine(String email) {

    UUID userId = users.findByEmail(email)
        .orElseThrow()
        .getId();

    System.out.println(userId);

    List<Booking> bookingsList = bookings.findMine(userId);

    // System.out.println("Booking: " + bookingsList);

    // bookingsList.forEach(booking -> {
    // System.out.println("Booking: " + booking.getId());
    // System.out.println("Seats: " + booking.getSeats().size());
    // System.out.println("Get Seats Seats: " + booking.getSeats());
    // List<String> seatNumbers =
    // booking.getSeats().stream().map(BookingSeat::getSeatNumber)
    // .collect(Collectors.toList());
    // System.out.println("Seat Numbers: " + seatNumbers);
    // });

    return bookingsList.stream().map(BookingResponse::from).toList();
  }

  @Transactional
  public BookingResponse cancel(UUID id, String email) {

    Booking booking = bookings.findById(id)
        .orElseThrow(() -> new NoSuchElementException("Booking not found"));

    if (!booking.getUser().getEmail().equals(email)) {
      throw new IllegalArgumentException("Not your booking");
    }

    if (booking.getStatus() == BookingStatus.CANCELLED) {
      throw new IllegalArgumentException("Booking is already cancelled");
    }

    booking.setStatus(BookingStatus.CANCELLED);

    Booking savedBooking = bookings.save(booking);

    return BookingResponse.from(savedBooking);
  }

}
