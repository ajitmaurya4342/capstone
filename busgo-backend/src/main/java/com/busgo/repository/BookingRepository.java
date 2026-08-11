package com.busgo.repository;

import com.busgo.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    @Query("select b from Booking b where b.user.id=:userId order by b.createdAt desc")
    List<Booking> findMine(@Param("userId") UUID userId);

    @Query("select bs.seatNumber from BookingSeat bs where bs.schedule.id=:scheduleId and bs.booking.status=com.busgo.entity.BookingStatus.CONFIRMED")
    List<String> bookedSeats(@Param("scheduleId") UUID scheduleId);
}
