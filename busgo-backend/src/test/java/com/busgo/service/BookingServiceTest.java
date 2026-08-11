
package com.busgo.service;

import com.busgo.dto.BookingRequest;
import com.busgo.dto.BookingResponse;
import com.busgo.entity.Booking;
import com.busgo.entity.BookingStatus;
import com.busgo.entity.Bus;
import com.busgo.entity.Schedule;
import com.busgo.entity.User;
import com.busgo.repository.BookingRepository;
import com.busgo.repository.ScheduleRepository;
import com.busgo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {

  @Mock
  BookingRepository bookings;

  @Mock
  ScheduleRepository schedules;

  @Mock
  UserRepository users;

  BookingService service;

  private User user;
  private Schedule schedule;
  private UUID scheduleId;

  @BeforeEach
  void setUp() {

    MockitoAnnotations.openMocks(this);

    service = new BookingService(
        bookings,
        schedules,
        users);

    scheduleId = UUID.randomUUID();

    user = new User();
    user.setId(UUID.randomUUID());
    user.setEmail("u@x.com");

    schedule = new Schedule();
    schedule.setId(scheduleId);
    schedule.setFare(new BigDecimal("500.00"));
  }

  @Test
  void duplicateSeatsFail() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.of(schedule));

    when(bookings.bookedSeats(scheduleId))
        .thenReturn(List.of());

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("1A", "1A"));

    assertThrows(
        IllegalArgumentException.class,
        () -> service.create(request, "u@x.com"));

    verify(bookings, never()).save(any());
  }

  @Test
  void bookedSeatFails() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.of(schedule));

    when(bookings.bookedSeats(scheduleId))
        .thenReturn(List.of("1A"));

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("1A"));

    assertThrows(
        IllegalArgumentException.class,
        () -> service.create(request, "u@x.com"));

    verify(bookings, never()).save(any());
  }

  @Test
  void invalidSeatNumberFails() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.of(schedule));

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("INVALID"));

    assertThrows(
        IllegalArgumentException.class,
        () -> service.create(request, "u@x.com"));

    verify(bookings, never()).save(any());
  }

  @Test
  void maximumFourSeatsAllowed() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.of(schedule));

    when(bookings.bookedSeats(scheduleId))
        .thenReturn(List.of());

    Booking savedBooking = new Booking();

    when(bookings.save(any(Booking.class)))
        .thenReturn(savedBooking);

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("1A", "1B", "1C", "1D"));

    Booking result = service.create(request, "u@x.com");

    assertNotNull(result);

    verify(bookings).save(any(Booking.class));
  }

  @Test
  void moreThanFourSeatsFails() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.of(schedule));

    when(bookings.bookedSeats(scheduleId))
        .thenReturn(List.of());

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of(
            "1A",
            "1B",
            "1C",
            "1D",
            "2A"));

    assertThrows(
        IllegalArgumentException.class,
        () -> service.create(request, "u@x.com"));

    verify(bookings, never()).save(any());
  }

  @Test
  void createBookingSuccessfully() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.of(schedule));

    when(bookings.bookedSeats(scheduleId))
        .thenReturn(List.of());

    when(bookings.save(any(Booking.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("1A", "1B"));

    Booking result = service.create(request, "u@x.com");

    assertNotNull(result);

    assertEquals(
        new BigDecimal("1000.00"),
        result.getTotalFare());

    assertEquals(
        user,
        result.getUser());

    assertEquals(
        schedule,
        result.getSchedule());

    assertEquals(
        2,
        result.getSeats().size());

    verify(bookings).save(any(Booking.class));
  }

  @Test
  void userNotFoundFails() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.empty());

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("1A"));

    assertThrows(
        NoSuchElementException.class,
        () -> service.create(request, "u@x.com"));

    verify(schedules, never()).findById(any());
    verify(bookings, never()).save(any());
  }

  @Test
  void scheduleNotFoundFails() {

    when(users.findByEmail("u@x.com"))
        .thenReturn(Optional.of(user));

    when(schedules.findById(scheduleId))
        .thenReturn(Optional.empty());

    BookingRequest request = new BookingRequest(
        scheduleId,
        List.of("1A"));

    assertThrows(
        NoSuchElementException.class,
        () -> service.create(request, "u@x.com"));

    verify(bookings, never()).bookedSeats(any());
    verify(bookings, never()).save(any());
  }

  @Test
  void cancelBookingSuccessfully() {

    UUID bookingId = UUID.randomUUID();

    User user = new User();
    user.setEmail("u@x.com");
    user.setName("Test User");

    Bus bus = new Bus();
    bus.setId(UUID.randomUUID());
    bus.setBusNumber("KA-01-AB-1234");
    bus.setOperatorName("Test Travels");
    bus.setTotalSeats(40);

    Schedule schedule = new Schedule();
    schedule.setId(UUID.randomUUID());
    schedule.setBus(bus);
    schedule.setFromCity("Hyderabad");
    schedule.setToCity("Bangalore");
    schedule.setFare(new BigDecimal("650"));

    Booking booking = new Booking();
    booking.setId(bookingId);
    booking.setUser(user);
    booking.setSchedule(schedule);
    booking.setTotalFare(new BigDecimal("650"));
    booking.setStatus(BookingStatus.CONFIRMED);

    when(bookings.findById(bookingId))
        .thenReturn(Optional.of(booking));

    when(bookings.save(booking))
        .thenReturn(booking);

    BookingResponse result = service.cancel(bookingId, "u@x.com");

    assertEquals(
        "CANCELLED",
        result.status());

    verify(bookings).save(booking);

  }

  @Test
  void cancelOtherUsersBookingFails() {

    UUID bookingId = UUID.randomUUID();

    User anotherUser = new User();
    anotherUser.setEmail("another@x.com");

    Booking booking = new Booking();
    booking.setUser(anotherUser);
    booking.setStatus(BookingStatus.CONFIRMED);

    when(bookings.findById(bookingId))
        .thenReturn(Optional.of(booking));

    assertThrows(
        IllegalArgumentException.class,
        () -> service.cancel(bookingId, "u@x.com"));

    verify(bookings, never()).save(any());
  }

  @Test
  void cancelBookingNotFoundFails() {

    UUID bookingId = UUID.randomUUID();

    when(bookings.findById(bookingId))
        .thenReturn(Optional.empty());

    assertThrows(
        NoSuchElementException.class,
        () -> service.cancel(bookingId, "u@x.com"));

    verify(bookings, never()).save(any());
  }
}
