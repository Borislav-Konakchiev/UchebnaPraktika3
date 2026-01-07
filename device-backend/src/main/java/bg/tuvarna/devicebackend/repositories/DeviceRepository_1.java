package bg.tuvarna.devicebackend.repositories;

import bg.tuvarna.devicebackend.models.entities.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    @Transactional
    @Modifying
    @Query("delete from Device d where d.serialNumber = ?1")
    void deleteBySerialNumber(String serialNumber);

    @Query("select distinct d from Device d " +
            "left join d.user u " +
            "left join d.passport p " +
            "where (?1 is null OR ( ?1 is not null AND (lower(d.serialNumber) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.fullName) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.address) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.email) LIKE concat('%',lower(?1),'%') OR " +
            "lower(u.phone) LIKE concat('%',lower(?1),'%') OR " +
            "lower(p.name) LIKE concat('%',lower(?1),'%') OR " +
            "lower(p.model) LIKE concat('%',lower(?1),'%'))))")
    Page<Device> findAll(String searchBy, Pageable pageable);

    @Query("select distinct d from Device d " +
            "left join d.user u " +
            "left join d.passport p ")
    Page<Device> getAllDevices(Pageable pageable);
}