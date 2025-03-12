import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { RegisteredDevice } from "./types.ts";

const supabaseUrl = Deno.env.get("FUNCTIONS_SUPABASE_URL")!;
const supabaseKey = Deno.env.get("FUNCTIONS_SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const BATCH_SIZE = 100;

export async function fetchRegisteredDevices(
  options: {
    enabledOnly?: boolean;
    deviceType?: "ios" | "android";
  } = {}
) {
  const devices: RegisteredDevice[] = [];
  let lastId = 0;
  let hasMore = true;

  console.log("[Devices] Starting batch fetch of registered devices...");

  while (hasMore) {
    try {
      let query = supabase
        .from("registered_devices_table")
        .select("*")
        .gt("id", lastId)
        .order("id", { ascending: true })
        .limit(BATCH_SIZE);

      // Add filters if specified
      if (options.enabledOnly) {
        query = query.eq("enabled_notifications", true);
      }

      if (options.deviceType) {
        query = query.eq("device_type", options.deviceType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("[Devices] Error fetching batch:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        hasMore = false;
        console.log("[Devices] No more devices to fetch");
        break;
      }

      devices.push(...data);
      lastId = data[data.length - 1].id;
      console.log(
        `[Devices] Fetched batch of ${data.length} devices. Last ID: ${lastId}`
      );

      // If we got fewer results than the batch size, we've reached the end
      if (data.length < BATCH_SIZE) {
        hasMore = false;
      }
    } catch (error) {
      console.error("[Devices] Batch fetch failed:", error);
      throw error;
    }
  }

  console.log(`[Devices] Completed fetch. Total devices: ${devices.length}`);
  return devices;
}

// Helper function to get only iOS devices with enabled notifications
export async function fetchEnabledIosDevices() {
  console.log("[Devices] Fetching enabled iOS devices...");

  const devices = await fetchRegisteredDevices({
    enabledOnly: true,
    deviceType: "ios",
  });

  console.log(`[Devices] Found ${devices.length} enabled iOS devices`);
  return devices;
}
