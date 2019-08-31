import axios from "axios";

export default async function({ store, redirect,app }) {
  if (store.$auth.loggedIn) {
    // required settings
    // for the app to run smoothly
    let requiredSettings = [
      "year_start",
      "year_end",
      "trimester_2_start",
      "trimester_3_start",
    ];

    // Check if the user's settings contains
    // ALL the required keys
    let { data } = await app.$axios.get("/settings/");
    // If he has not a single setting registered, skip
    // the rest of the check
    let missingSetupSettings = data.length < 1;
    // If some settings are registered
    if (!missingSetupSettings) {
      // get the keys registered that are part of `requiredKeys`:
      //  - map: get only the settings keys
      //  - filter: remove settings that are not required
      let keys = data
        .map(setting => setting.key)
        .filter(key => requiredSettings.includes(key));
      // If the array of required settings keys the user has
      // is smaller than the one required, some or all the required
      // settings are missing
      missingSetupSettings = keys.length < requiredSettings.length;
    }

    let res
    // Check if the user has at least ONE subject registered
    res = await app.$axios.get("http://localhost:7000/api/subjects/")
    let noSubjects = res.data.length < 1;

    // Check if the user has at least ONE event in his schedule
    res = await app.$axios.get("http://localhost:7000/api/events/")
    let scheduleIsEmpty = res.data.length < 1;

    // If any of the three checks has failed
    let notSettedUpProperly = missingSetupSettings || noSubjects || scheduleIsEmpty;
    if (false /* temp */) {
      // Redirect to the setup page
      redirect("/setup");
    }
  }
}
