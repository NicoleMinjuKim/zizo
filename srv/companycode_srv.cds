using zizo.companycode as companycode from '../db/companycode';

service CompanycodeService {
    entity Companycode as projection on companycode.Companycode;
}