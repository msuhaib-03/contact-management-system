package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private List<LabeledValueDTO> emails;
    private List<LabeledValueDTO> phoneNumbers;
    private LocalDateTime createdAt;
}
