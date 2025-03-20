package com.Backend.Backend.service;

import com.Backend.Backend.entity.Country;
import com.Backend.Backend.repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public Set<Country> addOrUpdateCountries(List<String> countryNames) {
        if (countryNames == null) return Collections.emptySet();

        return countryNames.stream()
                .filter(Objects::nonNull)
                .map(name -> countryRepository.findByName(name)
                        .orElseGet(() -> countryRepository.save(new Country(name, new HashSet<>()))))
                .collect(Collectors.toSet());
    }
}

