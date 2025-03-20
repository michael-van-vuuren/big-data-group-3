package com.Backend.Backend.service;

import com.Backend.Backend.entity.Country;
import com.Backend.Backend.entity.Roaster;
import com.Backend.Backend.repository.RoasterRepository;
import org.springframework.stereotype.Service;

@Service
public class RoasterService {
    private final RoasterRepository roasterRepository;
    private final CountryService countryService;

    public RoasterService(RoasterRepository roasterRepository, CountryService countryService) {
        this.roasterRepository = roasterRepository;
        this.countryService = countryService;
    }

    public Roaster addOrUpdateRoaster(String roasterName, String countryName) {
        if (roasterName == null) return null;

        Country country = countryService.addOrUpdateCountry(countryName);

        return roasterRepository.findByName(roasterName)
                .map(existingRoaster -> {
                    if (existingRoaster.getCountry() == null || !existingRoaster.getCountry().equals(country)) {
                        existingRoaster.setCountry(country);
                        return roasterRepository.save(existingRoaster);
                    }
                    return existingRoaster;
                })
                .orElseGet(() -> roasterRepository.save(new Roaster(roasterName, country)));
    }
}

