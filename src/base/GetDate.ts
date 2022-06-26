import momentTimezone from 'moment-timezone';
import { MasterDataInterface } from "./MasterData";

declare let window: Window;

const GetDate = (date: string, timezone: string) => {
  let _configuration = window.masterData.getData("configuration", {}) as any;
  let _timezone = timezone || _configuration.TIMEZONE;
  let mom = momentTimezone.tz(date, 'YYYY-MM-DD HH:mm:ss',_configuration.BASE_TIMEZONE);
  return mom.tz(_timezone).format("YYYY-MM-DD HH:mm:ss");
}

export default GetDate;