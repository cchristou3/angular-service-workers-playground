import { Component } from '@angular/core';
import { CheckForUpdateService } from './services/check-for-update/check-for-update.service';
import { LogUpdateService } from './services/log-update/log-update.service';
import { UpdateService } from './services/update-version/update-version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  //constructor(logUpdateService: LogUpdateService, checkForUpdateService: CheckForUpdateService){}
  constructor(updateService: UpdateService){}
}
