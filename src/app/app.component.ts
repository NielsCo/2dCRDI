import {Component, ElementRef, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {curveBasis} from 'd3-shape';
import {LegendPosition} from '@swimlane/ngx-charts';

export interface Pan {
  time: number;
  x: number;
  y: number;
}

export interface DataPoint {
  name: string,
  value: number,
}

export interface Series {
  name: string,
  series: DataPoint[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  data: Series[] = [];
  pans: Pan[] = [];

  @ViewChild('map') map: ElementRef | undefined;

  countDown: Subscription | undefined;
  counterResetTime = 120;
  counter = this.counterResetTime;
  tick = 1000;
  started = false;
  over = false;
  curve: any = curveBasis;

  reset() {
    this.pans = [];
    this.counter = this.counterResetTime;
    this.over = false;
    this.started = false;
    this.countDown?.unsubscribe();
  }

  logPan(evt: any) {
    if (!this.started) {
      this.started = true;
      this.countDown = timer(0, this.tick).subscribe(() => {
        if (this.counter > 0) {
          --this.counter;
        } else {
          if (!this.over) {
            this.createData();
            this.over = true;
          }
        }
      });
    }
    if (this.over) {
      return;
    }
    if (!this.map) {
      console.log('not found');
      return;
    }

    const maxX: number = this.map.nativeElement.offsetWidth;
    const maxY: number = this.map.nativeElement.offsetHeight;
    let x = evt.center.x - this.map.nativeElement.offsetLeft;
    x = x < 0 ? 0 : x;
    x = Math.min(x, maxX);
    let y = evt.center.y - this.map.nativeElement.offsetTop;
    y = y < 0 ? 0 : y;
    y = Math.min(y, maxY);

    x = x / maxX * 100;
    y = y / maxY * 100;

    y = Math.abs(y - 100);

    const pan = {
      time: evt.timeStamp,
      x: x,
      y: y,
    };

    this.pans.push(pan);
  }

  legend: boolean = true;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  legendPosition: LegendPosition = 'below' as LegendPosition;

  getEveryNth(arr: any[], nth: number): any[] {
    const result = [];

    for (let i = 0; i < arr.length; i += nth) {
      result.push(arr[i]);
    }

    return result;
  }

  createData() {
    const firstPan = this.pans[0];
    const firstTime = firstPan.time;

    const dataPointsX: DataPoint[] = [];
    const dataPointsY: DataPoint[] = [];

    let dataArray;

    console.log(this.pans.length);

    if (this.pans.length > 10000) {
      dataArray = this.getEveryNth(this.pans, 20);
    }
    else if (this.pans.length > 5000) {
      dataArray = this.getEveryNth(this.pans, 10);
    } else if (this.pans.length > 1000) {
      dataArray = this.getEveryNth(this.pans, 5);
    } else {
      dataArray = this.pans;
    }

    for (let pan of dataArray) {
      const time = (pan.time - firstTime) / 1000;
      dataPointsX.push({
        name: time.toString(),
        value: pan.x
      });
      dataPointsY.push({
        name: time.toString(),
        value: pan.y
      });
    }

    const xSeries: Series = {
      name: 'Ugly (0) to Beautiful (100)',
      series: dataPointsX,
    };
    const ySeries: Series = {
      name: 'Relaxing (0) to Exciting (100)',
      series: dataPointsY,
    };
    this.data = [xSeries, ySeries];
  }
}


@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
