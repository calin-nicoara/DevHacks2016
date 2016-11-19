package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.Subject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "subjects", path = "subjects")
public interface SubjectRestRepository extends JpaRepository<Subject, Long> {
}