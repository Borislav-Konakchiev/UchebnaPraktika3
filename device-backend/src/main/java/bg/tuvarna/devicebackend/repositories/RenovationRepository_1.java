package bg.tuvarna.devicebackend.repositories;

import bg.tuvarna.devicebackend.models.entities.Renovation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RenovationRepository extends JpaRepository<Renovation, Long> {
}