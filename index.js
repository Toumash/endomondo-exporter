require('cross-fetch/polyfill');
const { Api, MobileApi } = require('endomondo-api-handler');
const fs = require('fs');

let cfgFile = fs.readFileSync('./settings.json');
let cfg = JSON.parse(cfgFile);

const api = new Api();
const mobileApi = new MobileApi();

var login = cfg.login;
var password = cfg.password;

(async () => {
    await Promise.all([
        api.login(login, password),
        mobileApi.login(login, password),
    ]);

    console.log(await api.get('rest/session'));

    await api.processWorkouts({}, async (workout) => {
        console.log(workout.toString());
        if (workout.hasGPSData()) {
            var type = workout.getTypeName();
            fs.writeFileSync(`tmp/${type}_${workout.getId()}.gpx`, await api.getWorkoutGpx(workout.getId()), 'utf8');
        }
    });

})();