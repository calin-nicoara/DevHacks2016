package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tasks", path = "tasks")
public interface TaskRestRepository extends JpaRepository<Task, Long>{
}
