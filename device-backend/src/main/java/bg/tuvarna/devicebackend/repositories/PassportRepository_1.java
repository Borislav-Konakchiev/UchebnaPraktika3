package bg.tuvarna.devicebackend.repositories;

import bg.tuvarna.devicebackend.models.entities.Passport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassportRepository extends JpaRepository<Passport, Long> {
    @Query("select p from Passport p where p.serialPrefix like :serialPrefix and p.fromSerialNumber between :fromSerialNumberStart and :toSerialNumber" +
            " or p.serialPrefix like :serialPrefix and p.toSerialNumber between :fromSerialNumberStart and :toSerialNumber")
    List<Passport> findByFromSerialNumberBetween(String serialPrefix, int fromSerialNumberStart, int toSerialNumber);

    @Query("select p from Passport p where :serialId LIKE CONCAT(p.serialPrefix, '%')")
    List<Passport> findByFromSerial(String serialId);
}