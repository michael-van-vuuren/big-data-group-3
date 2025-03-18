package com.Backend.Backend.service;

import com.Backend.Backend.entity.Roaster;
import com.Backend.Backend.repository.RoasterRepository;
import org.springframework.stereotype.Service;

@Service
public class RoasterService {
    private final RoasterRepository roasterRepository;

    public RoasterService(RoasterRepository roasterRepository) {
        this.roasterRepository = roasterRepository;
    }

    // Find or create the Roaster (many-to-one)
    public Roaster addOrUpdateRoaster(String roasterName, String country) {
        if (roasterName == null) return null;

        return roasterRepository.findByName(roasterName)
                .map(existingRoaster -> {
                    if (country != null && !country.equals(existingRoaster.getCountry())) {
                        existingRoaster.setCountry(country);
                        return roasterRepository.save(existingRoaster);
                    }
                    return existingRoaster;
                })
                .orElseGet(() -> roasterRepository.save(new Roaster(roasterName, country)));
    }
}
