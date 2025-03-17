package com.Backend.Backend.service;

import com.Backend.Backend.entity.Roaster;
import com.Backend.Backend.repository.RoasterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoasterService {

    private final RoasterRepository roasterRepository;

    public RoasterService(RoasterRepository roasterRepository) {
        this.roasterRepository = roasterRepository;
    }

    @Transactional
    public void saveRoasters(List<Roaster> roasters) {
        Set<String> existingRoasters = new HashSet<>(roasterRepository.findAllNames());

        List<Roaster> newRoasters = roasters.stream()
                .filter(roaster -> !existingRoasters.contains(roaster.getName()))
                .toList();

        if (!newRoasters.isEmpty()) {
            roasterRepository.saveAll(newRoasters);
        }
    }

    public List<Roaster> getAllRoasters() {
        return roasterRepository.findAll();
    }
}
