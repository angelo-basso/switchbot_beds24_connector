export interface IBooking{
    bookingId: string;
    propertyId?: string;
    guestName: string;
    checkIn: Date;
    checkOut: Date;
    keypadDeviceId: string;
}