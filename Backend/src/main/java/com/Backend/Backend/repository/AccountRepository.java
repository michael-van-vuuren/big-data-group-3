package com.Backend.Backend.repository;

import com.Backend.Backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByName(String name);

    @Query("SELECT COUNT(p) FROM Account a JOIN a.favoriteProducts p WHERE a.id = :accountId")
    Long countFavoriteProductsByAccountId(@Param("accountId") Long accountId);

}
