package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.UserStudyGroupMap;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserStudyGroupMapRepository extends JpaRepository<UserStudyGroupMap, Long>{

    List<UserStudyGroupMap> findByUserId(Long userId);
}
