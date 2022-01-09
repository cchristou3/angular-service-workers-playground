import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class LogUpdateService {

  constructor(swUpdate: SwUpdate) {
    console.log('LogUpdateService is started...');
    swUpdate.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      console.log('Reloading page now...');      
      setTimeout(() => {
        swUpdate.activateUpdate().then(() => document.location.reload());
      }, 5000);
    });
    swUpdate.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}