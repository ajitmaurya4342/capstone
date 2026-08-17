package com.busgo.service;

import com.busgo.dto.ScheduleRequest;
import com.busgo.entity.Bus;
import com.busgo.entity.BusType;
import com.busgo.entity.Schedule;
import com.busgo.repository.BookingRepository;
import com.busgo.repository.BusRepository;
import com.busgo.repository.ScheduleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ScheduleServiceTest {

    @Mock
    ScheduleRepository repo;

    @Mock
    BusRepository buses;

    @Mock
    BookingRepository bookings;

    ScheduleService service;

    private UUID scheduleId;
    private UUID busId;

    private Bus bus;
    private Schedule schedule;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        service = new ScheduleService(
                repo,
                buses,
                bookings);

        scheduleId = UUID.randomUUID();
        busId = UUID.randomUUID();

        bus = new Bus();
        bus.setId(busId);
        bus.setBusNumber("KA-01-AB-1234");
        bus.setOperatorName("VRL Travels");
        bus.setTotalSeats(40);
        bus.setBusType(BusType.SEATER);

        LocalDate journeyDate = LocalDate.of(2026, 8, 18);

        schedule = new Schedule();
        schedule.setId(scheduleId);
        schedule.setBus(bus);
        schedule.setFromCity("Hyderabad");
        schedule.setToCity("Bangalore");

        schedule.setDepartureTime(
                journeyDate.atTime(21, 0));

        schedule.setArrivalTime(
                journeyDate.plusDays(1)
                        .atTime(6, 0));

        schedule.setFare(
                new BigDecimal("650"));

        schedule.setJourneyDate(journeyDate);
    }

    @Test
    void searchReturnsSchedules() {

        LocalDate date = LocalDate.of(2026, 8, 18);

        when(repo.search(
                "Hyderabad",
                "Bangalore",
                date))
                .thenReturn(List.of(schedule));

        List<Schedule> result = service.search(
                "Hyderabad",
                "Bangalore",
                date);

        assertEquals(1, result.size());

        assertEquals(
                schedule,
                result.get(0));

        verify(repo).search(
                "Hyderabad",
                "Bangalore",
                date);
    }

    @Test
    void searchReturnsEmptyWhenNoScheduleFound() {

        LocalDate date = LocalDate.of(2026, 8, 18);

        when(repo.search(
                "Mumbai",
                "Delhi",
                date))
                .thenReturn(List.of());

        List<Schedule> result = service.search(
                "Mumbai",
                "Delhi",
                date);

        assertNotNull(result);

        assertTrue(result.isEmpty());

        verify(repo).search(
                "Mumbai",
                "Delhi",
                date);
    }

    @Test
    void getScheduleReturnsAllSchedules() {

        when(repo.findAll())
                .thenReturn(List.of(schedule));

        List<Schedule> result = service.getSchedule();

        assertEquals(1, result.size());

        assertEquals(
                schedule,
                result.get(0));

        verify(repo).findAll();
    }

    @Test
    void getByIdReturnsScheduleSuccessfully() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.of(schedule));

        Schedule result = service.getById(scheduleId);

        assertNotNull(result);

        assertEquals(
                schedule,
                result);

        assertEquals(
                "Hyderabad",
                result.getFromCity());

        assertEquals(
                "Bangalore",
                result.getToCity());

        assertEquals(
                new BigDecimal("650"),
                result.getFare());

        verify(repo).findById(scheduleId);
    }

    @Test
    void getByIdScheduleNotFoundFails() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class,
                () -> service.getById(scheduleId));

        assertEquals(
                "Schedule not found",
                exception.getMessage());

        verify(repo).findById(scheduleId);
    }

    @Test
    void createScheduleSuccessfully() {

        ScheduleRequest request = new ScheduleRequest(
                busId,
                "Hyderabad",
                "Bangalore",
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        21,
                        0),
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        6,
                        0),
                new BigDecimal("650"),
                LocalDate.of(
                        2026,
                        8,
                        18));

        when(buses.findById(busId))
                .thenReturn(Optional.of(bus));

        when(repo.save(any(Schedule.class)))
                .thenAnswer(
                        invocation -> invocation.getArgument(0));

        Schedule result = service.create(request);

        assertNotNull(result);

        assertEquals(
                bus,
                result.getBus());

        assertEquals(
                "Hyderabad",
                result.getFromCity());

        assertEquals(
                "Bangalore",
                result.getToCity());

        assertEquals(
                new BigDecimal("650"),
                result.getFare());

        assertEquals(
                LocalDate.of(2026, 8, 18),
                result.getJourneyDate());

        assertEquals(
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        21,
                        0),
                result.getDepartureTime());

        assertEquals(
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        6,
                        0),
                result.getArrivalTime());

        verify(buses).findById(busId);

        verify(repo).save(any(Schedule.class));
    }

    @Test
    void createScheduleWhenBusNotFoundFails() {

        ScheduleRequest request = new ScheduleRequest(
                busId,
                "Hyderabad",
                "Bangalore",
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        21,
                        0),
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        6,
                        0),
                new BigDecimal("650"),
                LocalDate.of(
                        2026,
                        8,
                        18));

        when(buses.findById(busId))
                .thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class,
                () -> service.create(request));

        assertEquals(
                "Bus not found",
                exception.getMessage());

        verify(buses).findById(busId);

        verify(
                repo,
                never())
                .save(any(Schedule.class));
    }

    @Test
    void updateScheduleSuccessfully() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.of(schedule));

        when(buses.findById(busId))
                .thenReturn(Optional.of(bus));

        when(repo.save(any(Schedule.class)))
                .thenAnswer(
                        invocation -> invocation.getArgument(0));

        ScheduleRequest request = new ScheduleRequest(
                busId,
                "Hyderabad",
                "Bangalore",
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        22,
                        30),
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        7,
                        30),
                new BigDecimal("750"),
                LocalDate.of(
                        2026,
                        8,
                        18));

        Schedule result = service.update(
                scheduleId,
                request);

        assertNotNull(result);

        assertEquals(
                scheduleId,
                result.getId());

        assertEquals(
                "Hyderabad",
                result.getFromCity());

        assertEquals(
                "Bangalore",
                result.getToCity());

        assertEquals(
                new BigDecimal("750"),
                result.getFare());

        assertEquals(
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        22,
                        30),
                result.getDepartureTime());

        assertEquals(
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        7,
                        30),
                result.getArrivalTime());

        verify(repo).findById(scheduleId);

        verify(buses).findById(busId);

        verify(repo).save(schedule);
    }

    @Test
    void updateScheduleNotFoundFails() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.empty());

        ScheduleRequest request = new ScheduleRequest(
                busId,
                "Hyderabad",
                "Bangalore",
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        21,
                        0),
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        6,
                        0),
                new BigDecimal("650"),
                LocalDate.of(
                        2026,
                        8,
                        18));

        assertThrows(
                NoSuchElementException.class,
                () -> service.update(
                        scheduleId,
                        request));

        verify(repo).findById(scheduleId);

        verify(
                repo,
                never())
                .save(any(Schedule.class));
    }

    @Test
    void updateScheduleWhenBusNotFoundFails() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.of(schedule));

        when(buses.findById(busId))
                .thenReturn(Optional.empty());

        ScheduleRequest request = new ScheduleRequest(
                busId,
                "Hyderabad",
                "Bangalore",
                LocalDateTime.of(
                        2026,
                        8,
                        18,
                        21,
                        0),
                LocalDateTime.of(
                        2026,
                        8,
                        19,
                        6,
                        0),
                new BigDecimal("650"),
                LocalDate.of(
                        2026,
                        8,
                        18));

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class,
                () -> service.update(
                        scheduleId,
                        request));

        assertEquals(
                "Bus not found",
                exception.getMessage());

        verify(repo).findById(scheduleId);

        verify(buses).findById(busId);

        verify(
                repo,
                never())
                .save(any(Schedule.class));
    }

    @Test
    void seatsReturnsBookedSeats() {

        List<String> bookedSeats = List.of(
                "A1",
                "A2",
                "B1");

        when(repo.findById(scheduleId))
                .thenReturn(Optional.of(schedule));

        when(bookings.bookedSeats(scheduleId))
                .thenReturn(bookedSeats);

        List<String> result = service.seats(scheduleId);

        assertEquals(
                3,
                result.size());

        assertEquals(
                bookedSeats,
                result);

        verify(repo).findById(scheduleId);

        verify(bookings)
                .bookedSeats(scheduleId);
    }

    @Test
    void seatsReturnsEmptyWhenNoSeatsBooked() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.of(schedule));

        when(bookings.bookedSeats(scheduleId))
                .thenReturn(List.of());

        List<String> result = service.seats(scheduleId);

        assertNotNull(result);

        assertTrue(result.isEmpty());

        verify(repo).findById(scheduleId);

        verify(bookings)
                .bookedSeats(scheduleId);
    }

    @Test
    void seatsScheduleNotFoundFails() {

        when(repo.findById(scheduleId))
                .thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(
                NoSuchElementException.class,
                () -> service.seats(scheduleId));

        assertEquals(
                "Schedule not found",
                exception.getMessage());

        verify(repo).findById(scheduleId);

        verify(
                bookings,
                never())
                .bookedSeats(any());
    }

    @Test
    void deleteScheduleSuccessfully() {

        service.delete(scheduleId);

        verify(repo).deleteById(scheduleId);
    }

    @Test
    void getCitiesReturnsUniqueSortedCities() {

        Schedule schedule1 = new Schedule();

        schedule1.setFromCity("Hyderabad");
        schedule1.setToCity("Bangalore");

        Schedule schedule2 = new Schedule();

        schedule2.setFromCity("Mumbai");
        schedule2.setToCity("Pune");

        Schedule schedule3 = new Schedule();

        schedule3.setFromCity("Hyderabad");
        schedule3.setToCity("Delhi");

        when(repo.findAll())
                .thenReturn(
                        List.of(
                                schedule1,
                                schedule2,
                                schedule3));

        List<String> result = service.getCities();

        assertEquals(
                List.of(
                        "Bangalore",
                        "Delhi",
                        "Hyderabad",
                        "Mumbai",
                        "Pune"),
                result);

        verify(repo).findAll();
    }

    @Test
    void getCitiesIgnoresNullAndBlankCities() {

        Schedule schedule1 = new Schedule();

        schedule1.setFromCity("  Hyderabad  ");
        schedule1.setToCity(" Bangalore ");

        Schedule schedule2 = new Schedule();

        schedule2.setFromCity("   ");
        schedule2.setToCity(null);

        when(repo.findAll())
                .thenReturn(
                        List.of(
                                schedule1,
                                schedule2));

        List<String> result = service.getCities();

        assertEquals(
                List.of(
                        "Bangalore",
                        "Hyderabad"),
                result);

        verify(repo).findAll();
    }

    @Test
    void getCitiesReturnsEmptyWhenNoSchedules() {

        when(repo.findAll())
                .thenReturn(List.of());

        List<String> result = service.getCities();

        assertNotNull(result);

        assertTrue(result.isEmpty());

        verify(repo).findAll();
    }
}