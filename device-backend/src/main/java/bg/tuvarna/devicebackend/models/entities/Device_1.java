package bg.tuvarna.devicebackend.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devices", schema = "public")
@Getter
@Setter
public class Device {
    @Id
    @Column(name = "serialNumber", nullable = false)
    private String serialNumber;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpirationDate;
    private String comment;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "passport_id")
    private Passport passport;

    @OneToMany(mappedBy = "device", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Renovation> renovations = new ArrayList<>();

}