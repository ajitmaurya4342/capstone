package com.busgo.repository;
import com.busgo.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface BusRepository extends JpaRepository<Bus,UUID>{}
