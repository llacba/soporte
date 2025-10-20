import { REGION_NAMES } from '@communication/domain/type/RegionNames.js';
import { Nullable } from '@core/domain/type/Nullable.js';

export interface CrmContactCustomAttributes {
  contactId?: Nullable<number>;
  department?: Nullable<string>;
  region?: Nullable<REGION_NAMES>;
}
