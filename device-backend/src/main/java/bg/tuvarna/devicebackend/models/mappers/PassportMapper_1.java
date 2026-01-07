package bg.tuvarna.devicebackend.models.mappers;

import bg.tuvarna.devicebackend.models.dtos.PassportVO;
import bg.tuvarna.devicebackend.models.entities.Passport;

public class PassportMapper {
    public static Passport toEntity(PassportVO passportVO) {
        return Passport.builder()
                .name(passportVO.name())
                .model(passportVO.model())
                .serialPrefix(passportVO.serialPrefix())
                .warrantyMonths(passportVO.warrantyMonths())
                .fromSerialNumber(passportVO.fromSerialNumber())
                .toSerialNumber(passportVO.toSerialNumber())
                .build();
    }

    public static void updateEntity(Passport passport, PassportVO passportVO) {
        passport.setName(passportVO.name());
        passport.setModel(passportVO.model());
        passport.setWarrantyMonths(passportVO.warrantyMonths());
        passport.setSerialPrefix(passportVO.serialPrefix());
        passport.setFromSerialNumber(passportVO.fromSerialNumber());
        passport.setToSerialNumber(passportVO.toSerialNumber());
    }
}