import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
/**
 * Assuming the client (user) just visited our website
 * but the browser is still using an older version of it,
 * then once the application is stable this inconsistency 
 * will be spotted by SwUpdate and emit an available event.
 * Since we are subscribing to that event observable, our
 * callback will get triggered.
 * Callback: Display snackbar to user to reload the application.
 * Important sources: 
 * https://www.digitalocean.com/community/tutorials/angular-service-worker-updates
 * https://github.com/angular/angular/blob/8fbf40bf4000944c06458472142ca967ef8d3b1d/aio/src/app/shared/location.service.ts#L49-L53
 * https://github.com/angular/angular/blob/8fbf40bf4000944c06458472142ca967ef8d3b1d/aio/src/app/sw-updates/sw-updates.service.ts
 * Resources rfelated to SwUpdate documentation:
 * https://stackoverflow.com/questions/55494181/what-is-the-purpose-of-swupdate-activateupdate-in-angular
 * https://www.w3resource.com/angular/service-worker-in-production.php
 * Also see:
 * https://angular.io/guide/service-worker-getting-started sections Getting Started, Service Worker Communication.
 * 
 */
export class UpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    console.log('UpdateService started...');
    this.swUpdate.available.subscribe(evt => {
      console.log('An update was found!');
      const snack = this.snackbar.open('Update Available', 'Reload',
        { duration: 5000 /** dismiss after 5 seconds */ });
      snack
        .onAction()
        .subscribe(() => {
          swUpdate.activateUpdate().then(() => document.location.reload());
        });
    });
  }
}