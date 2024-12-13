import { Component } from '@angular/core';

interface Seat {
  number: number;
  booked: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numSeats: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  bookedSeatNumbers: number[] = []; // Store reserved seats numbers
  rows: Seat[][] = [];

  constructor() {
    this.initializeSeats();
  }

  // Initialize the 80 seats (7 seats per row, 3 in the last row)
  initializeSeats() {
    let seatNumber = 1;
    for (let i = 0; i < 11; i++) {
      let row = [];
      for (let j = 0; j < 7; j++) {
        row.push({ number: seatNumber++, booked: false });
      }
      this.rows.push(row);
    }

    // Last row with 3 seats
    let lastRow = [];
    for (let i = 0; i < 3; i++) {
      lastRow.push({ number: seatNumber++, booked: false });
    }
    this.rows.push(lastRow);
  }

  // Check seat availability and book seats
  reserveSeats() {
    this.errorMessage = '';
    this.successMessage = '';
    this.bookedSeatNumbers = [];

    if (this.numSeats < 1 || this.numSeats > 7) {
      this.errorMessage = 'You can reserve between 1 and 7 seats only.';
      return;
    }

    const availableSeats = this.findSeats();
    if (availableSeats.length >= this.numSeats) {
      for (let i = 0; i < this.numSeats; i++) {
        availableSeats[i].booked = true;
        this.bookedSeatNumbers.push(availableSeats[i].number); // Add seat number to the list
      }
      this.successMessage = `${this.numSeats} seats successfully reserved!`;
    } else {
      this.errorMessage = 'Not enough adjacent seats available.';
    }
  }

  // Find available seats in each row and prioritize booking in one row
  findSeats(): Seat[] {
    let seatsToBook: Seat[] = [];

    // Try to find seats in the same row
    for (let row of this.rows) {
      let availableSeats = row.filter(seat => !seat.booked);
      if (availableSeats.length >= this.numSeats) {
        return availableSeats;
      }
    }

    // If no row has enough seats, find nearby seats across rows
    for (let row of this.rows) {
      seatsToBook.push(...row.filter(seat => !seat.booked));
      if (seatsToBook.length >= this.numSeats) {
        return seatsToBook;
      }
    }

    return seatsToBook;
  }
}
