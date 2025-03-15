declare module 'suncalc' {
  export default interface SunCalc {
    // Add any methods or properties you need from SunCalc
    getPosition(date: Date, lat: number, lng: number): { azimuth: number; altitude: number };
    getTimes(date: Date, lat: number, lng: number): Record<string, Date>;
    // Add other methods as needed
  }
} 