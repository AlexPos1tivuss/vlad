package com.targeteer.repository;

import com.targeteer.entity.Task;
import com.targeteer.entity.TaskPriority;
import com.targeteer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByAuthor(User author);

    Optional<Task> findById(Long id);

    List<Task> findAllByAssignee(User user);

    @Query("""
   SELECT COUNT(t) 
   FROM Task t 
   WHERE t.assignee.id = :userId 
     AND t.priority = :priority 
     AND t.status = 'COMPLETED'
     AND MONTH(t.completedDate) = MONTH(CURRENT_DATE)
     AND YEAR(t.completedDate) = YEAR(CURRENT_DATE)
   """)
    int countCompletedByUserAndPriorityThisMonth(Long userId, TaskPriority priority);
}
