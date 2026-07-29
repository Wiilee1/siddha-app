package com.siddha.app;

import android.content.Intent;
import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        registerPlugin(MeditationPlugin.class);
    }
}

@CapacitorPlugin(name = "MeditationNative")
class MeditationPlugin extends Plugin {
    @PluginMethod
    public void startService(PluginCall call) {
        Integer interval = call.getInt("intervalMinutes");
        Integer total = call.getInt("totalSeconds");

        Intent intent = new Intent(getContext(), MeditationService.class);
        intent.putExtra("intervalMinutes", interval != null ? interval : 0);
        intent.putExtra("totalSeconds", total != null ? total : 0);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }
        call.resolve();
    }

    @PluginMethod
    public void stopService(PluginCall call) {
        Intent intent = new Intent(getContext(), MeditationService.class);
        getContext().stopService(intent);
        call.resolve();
    }
}
