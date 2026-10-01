const WEATHER_PUSH_ENDPOINT = "https://aqldnpnemmlljxwxpmfr.supabase.co/functions/v1/weather-push-subscribe";
window.WeatherPush = {
  async save(payload) {
    const response = await fetch(WEATHER_PUSH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("push-save");
    return response.json();
  }
};
