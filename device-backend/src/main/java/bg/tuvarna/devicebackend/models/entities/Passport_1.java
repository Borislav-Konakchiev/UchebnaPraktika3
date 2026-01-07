package bg.tuvarna.devicebackend.models.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passports", schema = "public")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Passport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    private String name;
    private String model;
    private String serialPrefix;
    private int fromSerialNumber;
    private int toSerialNumber;
    private int warrantyMonths;
}