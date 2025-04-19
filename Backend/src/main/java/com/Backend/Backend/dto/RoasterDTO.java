package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Roaster;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoasterDTO {
    private String name;
    private CountryDTO country;

    public static RoasterDTO fromEntity(Roaster roaster) {
        if (roaster == null) {
            return null;
        }
        return new RoasterDTO(
                roaster.getName(),
                CountryDTO.fromEntity(roaster.getCountry())
        );
    }
}
