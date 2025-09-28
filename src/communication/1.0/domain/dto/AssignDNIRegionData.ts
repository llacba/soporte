import { AssignPhoneRegionData } from '@communication/domain/dto/AssignPhoneRegionData.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';

export interface AssignDNIRegionData extends AssignPhoneRegionData {
  dni: DNI;
}
