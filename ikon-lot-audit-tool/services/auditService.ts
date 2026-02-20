
import { VehicleInfo, VehicleStatus } from '../types';

export const validateVIN = (vin: string): boolean => {
  const cleaned = vin.toUpperCase().replace(/\s/g, '');
  if (cleaned.length !== 17) return false;
  // VIN standards exclude I, O, Q
  const invalidChars = /[IOQ]/;
  if (invalidChars.test(cleaned)) return false;
  const validFormat = /^[A-Z0-9]+$/;
  return validFormat.test(cleaned);
};

export const lookupVehicle = async (vin: string): Promise<VehicleInfo> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const normalizedVin = vin.toUpperCase().trim();

  // Deterministic mock logic based on last character of VIN
  const lastChar = normalizedVin.slice(-1);
  
  if (lastChar === '0' || lastChar === 'X') {
    return {
      vin: normalizedVin,
      status: VehicleStatus.NOT_FOUND,
      description: "VIN not found in PlanetX database. This may be a new vehicle or data entry error.",
    };
  }

  if (['1', '3', '5', '7', '9'].includes(lastChar)) {
    return {
      vin: normalizedVin,
      imei: "123456789012345",
      dealer: "North Park Toyota",
      lastReport: "2 hours ago",
      status: VehicleStatus.OK,
      description: "Device installed, reporting, and assigned to correct dealer.",
    };
  }

  return {
    vin: normalizedVin,
    imei: "987654321098765",
    dealer: "Central Ford",
    issue: "Wrong dealer",
    status: VehicleStatus.NEEDS_ATTENTION,
    description: "Device not installed, wrong dealer, not reporting, or customer linked. Follow up required.",
  };
};
