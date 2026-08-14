
package com.busgo.service;

import com.busgo.dto.BusRequest;
import com.busgo.entity.Bus;
import com.busgo.entity.BusType;
import com.busgo.repository.BusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BusServiceTest {

        @Mock
        BusRepository repo;

        BusService service;

        private UUID busId;
        private Bus bus;

        @BeforeEach
        void setUp() {

                MockitoAnnotations.openMocks(this);

                service = new BusService(repo);

                busId = UUID.randomUUID();

                bus = new Bus();
                bus.setId(busId);
                bus.setBusNumber("KA-01-AB-1234");
                bus.setOperatorName("Test Travels");
                bus.setTotalSeats(40);
                bus.setBusType(BusType.SEATER);
        }

        @Test
        void allReturnsAllBuses() {

                when(repo.findAll())
                                .thenReturn(List.of(bus));

                List<Bus> result = service.all();

                assertEquals(1, result.size());

                assertEquals(bus, result.get(0));

                verify(repo).findAll();
        }

        @Test
        void createBusSuccessfully() {

                BusRequest request = new BusRequest(
                                "KA-01-AB-1234",
                                "Test Travels",
                                40,
                                BusType.SEATER);

                when(repo.save(any(Bus.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                Bus result = service.create(request);

                assertNotNull(result);

                assertEquals("KA-01-AB-1234", result.getBusNumber());

                assertEquals("Test Travels", result.getOperatorName());

                assertEquals(40, result.getTotalSeats());

                assertEquals(BusType.SEATER, result.getBusType());

                verify(repo).save(any(Bus.class));
        }

        @Test
        void updateBusSuccessfully() {

                when(repo.findById(busId))
                                .thenReturn(Optional.of(bus));

                when(repo.save(any(Bus.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                BusRequest request = new BusRequest(
                                "TS-09-CD-5678",
                                "New Travels",
                                50,
                                BusType.SLEEPER);

                Bus result = service.update(busId, request);

                assertNotNull(result);

                assertEquals("TS-09-CD-5678", result.getBusNumber());

                assertEquals("New Travels", result.getOperatorName());

                assertEquals(50, result.getTotalSeats());

                assertEquals(BusType.SLEEPER, result.getBusType());

                verify(repo).save(bus);
        }

        @Test
        void updateBusNotFoundFails() {

                when(repo.findById(busId))
                                .thenReturn(Optional.empty());

                BusRequest request = new BusRequest(
                                "TS-09-CD-5678",
                                "New Travels",
                                50,
                                BusType.SLEEPER);

                assertThrows(
                                NoSuchElementException.class,
                                () -> service.update(busId, request));

                verify(repo, never()).save(any());
        }

        @Test
        void deleteBusSuccessfully() {

                service.delete(busId);

                verify(repo).deleteById(busId);
        }
}