package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.Test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tests", path = "tests")
public interface TestRestRepository extends JpaRepository<Test, Long>{
}
