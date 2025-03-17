package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Roaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoasterRepository extends JpaRepository<Roaster, Integer> {
    Roaster findByName(String name);

    @Query("SELECT r.name FROM Roaster r")
    List<String> findAllNames();
}
