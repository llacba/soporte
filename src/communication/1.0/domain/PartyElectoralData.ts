import { Region } from '@communication/domain/dto/Region.js';
import { DNI } from '@communication/domain/valueObject/DNI.js';
import { Nullable } from '@core/domain/type/Nullable.js';
import { Phone } from '@core/domain/valueObject/Phone.js';

export interface PartyElectoralData {
  getRegionByDni (dni: DNI): Promise<Nullable<Region>>
  getRegionByPhone (phone: Phone): Promise<Nullable<Region>>
}

export const PARTY_ELECTORAL_DATA = Symbol.for('PartyElectoralData');
