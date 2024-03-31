import {EventEmitter} from '@angular/core';

export class EventService {

  private static emitters: {
    [eventName: string]: EventEmitter<any>
  } = {}

  static get(eventName: string): EventEmitter<any> {
    if (!this.emitters[eventName]) {
      this.emitters[eventName] = new EventEmitter<any>();
    }
    return this.emitters[eventName];
  }

}
