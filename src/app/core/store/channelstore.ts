import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChannelService } from '../channelservice.service';

@Injectable()
export class ChannelStore {

  private latestChannelId: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor( private channelService: ChannelService ) { }

  get Channel_Id() {
    return this.latestChannelId.asObservable().filter(id => id != null );
  }

  LoadChannelId() {
    this.channelService.getChannelId().subscribe(
      Channels => { this.latestChannelId.next(Channels[0].Id); });
  }
}
