package com.siddha.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.util.Log;

public class MeditationAlarmReceiver extends BroadcastReceiver {
    private static final String TAG = "MeditationAlarmReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "onReceive: Alarm broadcast received from AlarmManager!");

        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = null;

        try {
            if (powerManager != null) {
                wakeLock = powerManager.newWakeLock(
                        PowerManager.PARTIAL_WAKE_LOCK,
                        "Siddha::AlarmReceiverWakeLock"
                );
                // Keep CPU awake for 30 seconds to allow bell playback to complete even in deep Doze
                wakeLock.acquire(30000L);
                Log.d(TAG, "Acquired AlarmReceiver wake lock (30s)");
            }

            // Forward the tick to MeditationService to process progress and play bells
            MeditationService.processAlarmTick(context);

        } catch (Exception e) {
            Log.e(TAG, "Error in MeditationAlarmReceiver.onReceive", e);
        }
    }
}
