import { Component, OnInit, OnDestroy } from '@angular/core';
import { RtpsavingsdetailsService } from 'app/core/rtpsavingsdetails.service';
import { Subscription } from 'rxjs';
import { IRTPMonthlySavings } from 'app/core/models/savings/rtpmonthlysavings.model';
import { environment } from 'environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'mygexa-rtp-savings-details',
  templateUrl: './rtp-savings-details.component.html',
  styleUrls: ['./rtp-savings-details.component.scss']
})
export class RtpSavingsDetailsComponent implements OnInit, OnDestroy {

  private savingsDetailsSubscription: Subscription;
  public savingsDetails: IRTPMonthlySavings;

  public wholesaleAverageWholeCents: number;
  public wholesaleAverageDecimalCents: string;
  public wholesalePriceWhole: number;
  public wholesalePriceDecimal: string;

  public txAverageWholeCents: number;
  public txAverageDecimalCents: string;
  public txAveragePriceWhole: number;
  public txAveragePriceDecimal: string;

  public savingsWhole: number;
  public savingsCents: string;

  public averagePriceYear: number = moment().subtract(1, "year").toDate().getFullYear();

  constructor(
    private RtpsavingsdetailsService: RtpsavingsdetailsService
  ) { }

  ngOnInit() {
    this.savingsDetailsSubscription = this.RtpsavingsdetailsService.SavingsInfo.subscribe(details => {
      this.savingsDetails = details;
      if (details != null) {
        this.processDetailsForUI();
      }
    });
  }

  ngOnDestroy() {
    this.RtpsavingsdetailsService.SavingsInfo.next(null);
    this.savingsDetailsSubscription.unsubscribe();
  }

  private processDetailsForUI(): void {
    const averageCentsPerKwh = (this.savingsDetails.yourPrice / this.savingsDetails.kWh * 100).toFixed(2);
    this.wholesaleAverageWholeCents = Math.trunc(Number(averageCentsPerKwh));
    this.wholesaleAverageDecimalCents = Number(Number(averageCentsPerKwh) % 1).toFixed(2).toString().split('.')[1];

    const wholesalePrice = this.savingsDetails.yourPrice.toFixed(2);
    this.wholesalePriceWhole = Math.trunc(Number(wholesalePrice));
    this.wholesalePriceDecimal = Number(Number(wholesalePrice) % 1).toFixed(2).toString().split('.')[1];

    const txAverageCentsPerKwh = environment.RTP_EIA_average_rate;
    this.txAverageWholeCents = Math.trunc(Number(txAverageCentsPerKwh));
    this.txAverageDecimalCents = Number(Number(txAverageCentsPerKwh) % 1).toFixed(2).toString().split('.')[1];

    const txAveragePrice = this.savingsDetails.averagePrice.toFixed(2);
    this.txAveragePriceWhole = Math.trunc(Number(txAveragePrice));
    this.txAveragePriceDecimal = Number(Number(txAveragePrice) % 1).toFixed(2).toString().split('.')[1];

    const savings = this.savingsDetails.savings.toFixed(2);
    this.savingsWhole = Math.trunc(Number(savings));
    this.savingsCents = Number(Number(savings) % 1).toFixed(2).toString().split('.')[1];
  }

}
