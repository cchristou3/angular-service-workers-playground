import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {

  constructor(appRef: ApplicationRef, swUpdate: SwUpdate) {
    console.log('CheckForUpdateService started...');
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everyFiveSeconds$ = interval(5 * 1000);
    const everyFiveSecondsOnceAppIsStable$ = concat(appIsStable$, everyFiveSeconds$);

    everyFiveSecondsOnceAppIsStable$.subscribe(() => {
      console.log('Checking for an update');
      swUpdate.checkForUpdate();
    });
    // if swUpdate.checkForUpdate finds an update then 
    // swUpdate.available will emit an event
  }
}