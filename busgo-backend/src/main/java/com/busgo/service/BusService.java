package com.busgo.service;
import com.busgo.dto.BusRequest; import com.busgo.entity.Bus; import com.busgo.repository.BusRepository; import org.springframework.stereotype.Service; import java.util.*;
@Service
public class BusService {
 private final BusRepository repo; public BusService(BusRepository r){repo=r;}
 public List<Bus> all(){return repo.findAll();}
 public Bus create(BusRequest r){Bus b=new Bus();return save(b,r);}
 public Bus update(UUID id,BusRequest r){return save(repo.findById(id).orElseThrow(()->new NoSuchElementException("Bus not found")),r);}
 private Bus save(Bus b,BusRequest r){b.setBusNumber(r.busNumber());b.setOperatorName(r.operatorName());b.setTotalSeats(r.totalSeats());b.setBusType(r.busType());return repo.save(b);}
 public void delete(UUID id){repo.deleteById(id);}
}
