package bg.tuvarna.devicebackend.urepo;

import bg.tuvarna.devicebackend.models.entities.Device;
import bg.tuvarna.devicebackend.models.entities.Passport;
import bg.tuvarna.devicebackend.models.entities.User;
import bg.tuvarna.devicebackend.models.enums.UserRole;
import bg.tuvarna.devicebackend.repositories.DeviceRepository;
import bg.tuvarna.devicebackend.repositories.PassportRepository;
import bg.tuvarna.devicebackend.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepoTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PassportRepository passportRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @BeforeEach
    void setUp() {
        deviceRepository.deleteAll();
        passportRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getByEmail_shouldReturnUser_whenExists() {
        User u = new User();
        u.setFullName("Ivan");
        u.setEmail("ivan@mail.com");
        u.setPhone("0888000001");
        u.setPassword("x");
        u.setRole(UserRole.USER);
        userRepository.save(u);

        User found = userRepository.getByEmail("ivan@mail.com");
        assertNotNull(found);
        assertEquals("Ivan", found.getFullName());
    }

    @Test
    void getByPhone_shouldReturnUser_whenExists() {
        User u = new User();
        u.setFullName("Maria");
        u.setEmail("maria@mail.com");
        u.setPhone("0888000002");
        u.setPassword("x");
        u.setRole(UserRole.USER);
        userRepository.save(u);

        User found = userRepository.getByPhone("0888000002");
        assertNotNull(found);
        assertEquals("maria@mail.com", found.getEmail());
    }

    @Test
    void findByEmailOrPhone_shouldFindUser_whenSearchByEmail() {
        User u = new User();
        u.setFullName("Georgi");
        u.setEmail("georgi@mail.com");
        u.setPhone("0888000003");
        u.setPassword("x");
        u.setRole(UserRole.USER);
        userRepository.save(u);

        var found = userRepository.findByEmailOrPhone("georgi@mail.com");
        assertTrue(found.isPresent());
        assertEquals("Georgi", found.get().getFullName());
    }

    @Test
    void getAllUsers_shouldExcludeAdmins() {
        User admin = new User();
        admin.setFullName("Admin");
        admin.setEmail("admin@mail.com");
        admin.setPhone("000");
        admin.setPassword("x");
        admin.setRole(UserRole.ADMIN);

        User user = new User();
        user.setFullName("User");
        user.setEmail("user@mail.com");
        user.setPhone("111");
        user.setPassword("x");
        user.setRole(UserRole.USER);

        userRepository.save(admin);
        userRepository.save(user);

        var page = userRepository.getAllUsers(PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
        assertEquals("user@mail.com", page.getContent().get(0).getEmail());
    }

    @Test
    void searchBy_shouldReturnUser_whenMatchByDeviceSerial() {
        Passport p = Passport.builder()
                .name("TestPassport")
                .model("M1")
                .serialPrefix("ABC")
                .fromSerialNumber(1)
                .toSerialNumber(9999)
                .warrantyMonths(24)
                .build();
        p = passportRepository.save(p);

        User user = new User();
        user.setFullName("Petar");
        user.setEmail("petar@mail.com");
        user.setPhone("222");
        user.setPassword("x");
        user.setRole(UserRole.USER);
        user = userRepository.save(user);

        Device d = new Device();
        d.setSerialNumber("ABC100");
        d.setPassport(p);
        d.setUser(user);
        d.setPurchaseDate(LocalDate.of(2025, 1, 1));
        d.setWarrantyExpirationDate(LocalDate.of(2027, 1, 1));
        deviceRepository.save(d);

        var page = userRepository.searchBy("ABC100", PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
        assertEquals("petar@mail.com", page.getContent().get(0).getEmail());
    }
}
