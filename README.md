# MyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.5.

## Development server

No need to run `ng serve` for a dev server, as service workers do not work with it.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Then proceed to run `http-server -p 8080 -c-1 dist/my-app`. A http server will be hosted to
serve the application. This server is used to test our project locally. 

 Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

 The http server caches for each client the version of the application that they are using.

## Initial load

With the server running, point your browser at http://localhost:8080/. Your application should load normally.

## Utilizing the SwUpdate service to listen for version updates

### UpdateService
The UpdateService does the following tasks:
1) every five seconds it checks whether a new version was released
2) when found an snackbar pops out that prompts the user to reload the application
```
@Injectable({
  providedIn: 'root'
})
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
```
### LogUpdateService

The LogUpdateService is ideal for the following scenario:
1) when the browser has cached an older version of the application
2) the user visits the website
3) once the application is stable the browser will compare the hashes between the current
cached application and its latest version. If inconsistent, then an event is fired in
swUpdate.available, causing the application to reload after a minor delay.
```
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
```

### CheckForUpdateService

The CheckForUpdateService class is utilized to monitor the project for updates.
```
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
```
