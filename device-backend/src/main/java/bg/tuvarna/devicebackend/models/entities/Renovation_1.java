package bg.tuvarna.devicebackend.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "renovations", schema = "public")
@Getter
@Setter
public class Renovation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    private String description;
    private LocalDate renovationDate;

    @ManyToOne
    @JoinColumn(name = "device_serial_number")
    @JsonIgnore
    private Device device;
}
