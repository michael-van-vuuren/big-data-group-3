package com.Backend.Backend.dto;

import com.Backend.Backend.entity.Process;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDTO {
    private String name;
    private String tag;

    public static ProcessDTO fromEntity(Process process) {
        if (process == null) {
            return null;
        }
        return new ProcessDTO(
                process.getName(),
                process.getTags()
        );
    }

}
