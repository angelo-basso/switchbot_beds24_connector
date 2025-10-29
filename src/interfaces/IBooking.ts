export interface IBooking{
    bookingId: string;
    propertyId?: string;
    guestName: string;
    guestEmail: string;
    checkIn: Date;
    checkOut: Date;
    keypadDeviceId: string;
}