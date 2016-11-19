package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.AppUser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users", path = "/users")
public interface UserRestRepository extends JpaRepository<AppUser, Long>{
}
