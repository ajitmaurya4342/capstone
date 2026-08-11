package com.busgo.repository;

import com.busgo.entity.Schedule;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.*;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    @Query("select s from Schedule s where lower(s.fromCity)=lower(:from) and lower(s.toCity)=lower(:to) and s.journeyDate=:date")
    List<Schedule> search(@Param("from") String from, @Param("to") String to, @Param("date") LocalDate date);
}
