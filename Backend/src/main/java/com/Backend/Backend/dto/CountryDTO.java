package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Country;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CountryDTO {
    private String name;

    public static CountryDTO fromEntity(Country country) {
        if (country == null) {
            return null;
        }
        return new CountryDTO(country.getName());
    }
}