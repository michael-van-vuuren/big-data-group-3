package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Flavor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlavorDTO {
    private String name;

    public static FlavorDTO fromEntity(Flavor flavor) {
        if (flavor == null) {
            return null;
        }
        return new FlavorDTO(flavor.getName());
    }
}
