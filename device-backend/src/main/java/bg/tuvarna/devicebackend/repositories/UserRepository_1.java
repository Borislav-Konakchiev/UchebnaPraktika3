package bg.tuvarna.devicebackend.repositories;

import bg.tuvarna.devicebackend.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User getByEmail(String email);

    @Query("select u from User u where u.email = ?1 OR u.phone = ?1")
    Optional<User> findByEmailOrPhone(String email);

    User getByPhone(String phone);

    @Query("select distinct u from User u " +
            "left join u.devices d " +
            "left join d.passport p " +
            "where u.role!='ADMIN' AND (?1 is null OR ( ?1 is not null AND lower(u.fullName) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.address) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.email) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.phone) LIKE concat('%',lower(?1),'%') OR " +
            "lower(p.name) LIKE concat('%',lower(?1),'%') OR " +
            "lower(p.model) LIKE concat('%',lower(?1),'%') OR " +
            "lower(d.serialNumber) LIKE concat('%',lower(?1),'%')))")
    Page<User> searchBy(String searchBy, Pageable pageable);

    @Query("select distinct u from User u " +
            "left join u.devices d " +
            "left join d.passport p " +
            "where u.role!='ADMIN'")
    Page<User> getAllUsers(Pageable pageable);
}