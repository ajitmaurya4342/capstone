package com.busgo.config;

import com.busgo.entity.*;
import com.busgo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.*;

@Configuration
public class SeedDataConfig {
    @Bean
    CommandLineRunner seed(UserRepository users, BusRepository buses, ScheduleRepository schedules,
            PasswordEncoder encoder, @Value("${app.seed-demo-data:false}") boolean enabled) {
        return args -> {
            if (!enabled || users.count() > 0)
                return;
            User admin = new User();
            admin.setEmail("admin@busgo.com");
            admin.setName("Admin");
            admin.setPassword(encoder.encode("Admin@123"));
            admin.setAdmin(true);
            users.save(admin);
            User user = new User();
            user.setEmail("user@busgo.com");
            user.setName("Demo User");
            user.setPassword(encoder.encode("User@123"));
            user.setAdmin(false);
            users.save(user);
            Bus b1 = new Bus();
            b1.setBusNumber("KA-01-AB-1234");
            b1.setOperatorName("VRL Travels");
            b1.setTotalSeats(40);
            b1.setBusType(BusType.SEATER);
            buses.save(b1);
            Bus b2 = new Bus();
            b2.setBusNumber("TN-02-CD-5678");
            b2.setOperatorName("SRS Travels");
            b2.setTotalSeats(40);
            b2.setBusType(BusType.SLEEPER);
            buses.save(b2);
            LocalDate d = LocalDate.now().plusDays(1);
            Schedule s1 = new Schedule();
            s1.setBus(b1);
            s1.setFromCity("Hyderabad");
            s1.setToCity("Bangalore");
            s1.setDepartureTime(d.atTime(21, 0));
            s1.setArrivalTime(d.plusDays(1).atTime(6, 0));
            s1.setFare(new BigDecimal("650"));
            s1.setJourneyDate(d);
            schedules.save(s1);
            Schedule s2 = new Schedule();
            s2.setBus(b2);
            s2.setFromCity("Hyderabad");
            s2.setToCity("Bangalore");
            s2.setDepartureTime(d.atTime(22, 30));
            s2.setArrivalTime(d.plusDays(1).atTime(7, 30));
            s2.setFare(new BigDecimal("750"));
            s2.setJourneyDate(d);
            schedules.save(s2);
        };
    }
}
