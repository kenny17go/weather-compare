const WEATHER_PUSH_ENDPOINT = "https://aqldnpnemmlljxwxpmfr.supabase.co/functions/v1/weather-push-subscribe";
const WEATHER_VAPID_PUBLIC = "BJpx6wVe3_CxNas7y1_0LvffRkB_LrTxB-4jXcpbjvEJCq-1TGVdZjWT0ITWVSjGbGC7Cg4aq1dPHxcL_Z2fnMA";
function weatherPushId(){let id=localStorage.getItem("weatherPushDeviceId");if(!id){id=crypto.randomUUID();localStorage.setItem("weatherPushDeviceId",id)}return id}
function weatherPushKey(s){const p="=".repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from([...b].map(x=>x.charCodeAt(0)))}
window.WeatherPush = {
  async save(payload={}) {
    payload.deviceId=weatherPushId();
    if(payload.enabled){
      if(!("serviceWorker" in navigator)||!("PushManager" in window)||!("Notification" in window)) throw new Error("unsupported");
      const permission=await Notification.requestPermission();
      if(permission!=="granted") throw new Error("permission");
      const reg=await navigator.serviceWorker.ready;
      let sub=await reg.pushManager.getSubscription();
      if(!sub) sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:weatherPushKey(WEATHER_VAPID_PUBLIC)});
      payload.subscription=sub.toJSON();
    }
    const response = await fetch(WEATHER_PUSH_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(!response.ok) throw new Error("push-save");
    return response.json();
  }
};
