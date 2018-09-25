// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCfvU7AEJ9hcVeo5UHxoondm97SpZEgl3E',
    authDomain: 'dbd-ui.firebaseapp.com',
    databaseURL: 'https://dbd-ui.firebaseio.com',
    projectId: 'dbd-ui',
    storageBucket: 'dbd-ui-blob',
    messagingSenderId: '401525491596'
  },
  masterPassword: 'DBD@2018!T',
  algolia: {
    app_id: '8P08T5HQ5R',
    search_key: '5aa623f5b2ef1a8ea52db04bc15b10cf',
    admin_key: '8bdbd9337bd218425419317ad51410d7'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
