package com.madSckillsExeption.resources;


import com.madSckillsExeption.entities.Question;
import com.madSckillsExeption.entities.QuizQuestionMap;
import com.madSckillsExeption.repositories.QuizQuestionMapRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/custom/questions")
public class QuestionResource {

    private QuizQuestionMapRepository quizQuestionMapRepository;

    @Autowired
    public QuestionResource(QuizQuestionMapRepository quizQuestionMapRepository) {
        this.quizQuestionMapRepository = quizQuestionMapRepository;
    }

    @GetMapping
    public ResponseEntity<List<Question>> getQuestionsByQuiz(@RequestParam(value= "page", required = false, defaultValue = "0") Integer page,
                                                            @RequestParam(value = "size", required = false, defaultValue = "20") Integer size,
                                                            @RequestParam("quizId") Long quizId) {
        List<Question> questions = quizQuestionMapRepository.findByQuizId(quizId, new PageRequest(page, size, new Sort(Sort.Direction.ASC, "id")))
                .stream().map(QuizQuestionMap::getQuestion).collect(Collectors.toList());

        return ResponseEntity.ok(questions);
    }
}
