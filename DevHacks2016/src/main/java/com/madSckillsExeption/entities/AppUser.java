package com.madSckillsExeption.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
public class AppUser {

    @Id
    private Long id;

    private String fullName;

    private String email;

    private String latitude;

    private String longitude;

    private String imageLink;
}
