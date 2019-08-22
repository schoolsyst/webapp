import axios from "axios";

export default async function({ store, redirect,app }) {
  if (store.$auth.loggedIn) {
    // required settings
    // for the app to run smoothly
    let requiredSettings = [
      "schedule/start",
      "schedule/start",
      "schedule/trimester2",
      "schedule/trimester3",
      "schedule/end",
      "schedule/offdays",
      "schedule/hours",
      "defaults/grades/max",
      "defaults/grades/weight"
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

    // Check if the user has at least ONE subject registered
    data = await axios.get("http://localhost:7000/api/subjects/", {
      headers: { Authorization: store.$auth.$storage._state["_token.local"] }
    });
    let noSubjects = data.length < 1;

    // Check if the user has at least ONE event in his schedule
    data = await axios.get("http://localhost:7000/api/events/", {
      headers: { Authorization: store.$auth.$storage._state["_token.local"] }
    });
    let scheduleIsEmpty = data.length < 1;

    // If any of the three checks has failed
    let notSettedUpProperly = missingSetupSettings || noSubjects || scheduleIsEmpty;
    if (false /* temp */) {
      // Redirect to the setup page
      redirect("/setup");
    }
  }
}
