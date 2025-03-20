package com.Backend.Backend.service;

import com.Backend.Backend.entity.Country;
import com.Backend.Backend.repository.CountryRepository;
import com.Backend.Backend.util.ProductValidate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    // Find or create Countries
    public Set<Country> addOrUpdateCountries(List<String> countryNames) {
        if (countryNames == null) return Collections.emptySet();

        return countryNames.stream()
                .map(ProductValidate::validate)
                .filter(Objects::nonNull)
                .map(name -> countryRepository.findByName(name)
                        .orElseGet(() -> countryRepository.save(new Country(name, new HashSet<>()))))
                .collect(Collectors.toSet());
    }

    // Find or create a Country
    public Country addOrUpdateCountry(String countryName) {
        final String validName = ProductValidate.validate(countryName);
        if (validName == null) return null;

        return countryRepository.findByName(validName)
                .orElseGet(() -> countryRepository.save(new Country(validName, new HashSet<>())));
    }

}

