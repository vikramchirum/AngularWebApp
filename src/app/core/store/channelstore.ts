import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChannelService } from '../channelservice.service';
import { OfferService } from '../offer.service';
import { IChannel } from '../models/channel/channel.model';

@Injectable()
export class ChannelStore {

  private latestChannelId: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor( private channelService: ChannelService,
               private offerService: OfferService ) { }

  get Channel_Id() {
    return this.latestChannelId.asObservable().filter(id => id != null );
  }

  LoadChannelId() {
    this.channelService.getChannelId().subscribe(
      Channels => { console.log('channel', Channels[0]); this.latestChannelId.next(Channels[0].Id); });
  }
}
