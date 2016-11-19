package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.StudyGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "studyGroups", path = "studyGroups")
public interface StudyGroupRestRepository extends JpaRepository<StudyGroup, Long>{
}