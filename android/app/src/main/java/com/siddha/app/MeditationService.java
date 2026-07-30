package com.siddha.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import java.util.ArrayList;
import java.util.List;
import android.os.Looper;
import android.os.PowerManager;
import android.content.pm.ServiceInfo;
import android.os.SystemClock;
import androidx.core.app.NotificationCompat;
import android.os.Vibrator;
import android.os.VibrationEffect;

public class MeditationService extends Service {
    private static final String CHANNEL_ID = "meditation_service_channel";
    private PowerManager.WakeLock wakeLock;
    private MediaPlayer keepAlivePlayer;
    private final Handler timerHandler = new Handler(Looper.getMainLooper());
    private int intervalSeconds = 0;
    private final List<MediaPlayer> activeBells = new ArrayList<>();
    private int totalSeconds = 0;
    private long startTimeMillis = 0;
    private int lastIntervalPlayed = 0;

    private void triggerHapticPulse() {
        try {
            Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    vibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_HEAVY_CLICK));
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createOneShot(350, 255));
                } else {
                    vibrator.vibrate(350);
                }
            }
        } catch (Exception e) {}
    }

    private final Runnable timerRunnable = new Runnable() {
        @Override
        public void run() {
            long now = SystemClock.elapsedRealtime();
            int actualElapsedSeconds = (int) ((now - startTimeMillis) / 1000);
            
            // Check interval bell
            if (intervalSeconds > 0) {
                int currentIntervalBoundary = actualElapsedSeconds / intervalSeconds;
                if (currentIntervalBoundary > lastIntervalPlayed && actualElapsedSeconds < totalSeconds && actualElapsedSeconds > 0) {
                    playBell(R.raw.interval_bell, true);
                    lastIntervalPlayed = currentIntervalBoundary;
                }
            }

            // Check completion
            if (actualElapsedSeconds >= totalSeconds) {
                // Unregister timerRunnable so it doesn't re-trigger playBell every second
                timerHandler.removeCallbacks(this);

                playBell(R.raw.end_bell, false);
                
                // Synchronize haptics precisely with the 3 chimes in end_bell.mp3 (at 2.0s, 11.5s, 18.5s)
                timerHandler.postDelayed(() -> triggerHapticPulse(), 2000);
                timerHandler.postDelayed(() -> triggerHapticPulse(), 11500);
                timerHandler.postDelayed(() -> triggerHapticPulse(), 18500);

                // Stop service after 25s delay to allow all 3 chimes to complete
                timerHandler.postDelayed(() -> stopSelf(), 25000);
            } else {
                timerHandler.postDelayed(this, 1000);
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Siddha::MeditationWakeLock");
        wakeLock.acquire(120 * 60 * 1000L); // 2 hour max

        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            intervalSeconds = intent.getIntExtra("intervalSeconds", 0);
            totalSeconds = intent.getIntExtra("totalSeconds", 0);
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Meditation in Progress")
                .setContentText("Keeping your sanctuary peaceful...")
                .setSmallIcon(android.R.drawable.ic_lock_idle_low_battery)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .build();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(1, notification);
        }
        
        // Native Keep-Alive Audio (Silent loop to maintain Media Session)
        try {
            if (keepAlivePlayer != null) {
                keepAlivePlayer.stop();
                keepAlivePlayer.release();
            }
            // Use interval_bell at near-zero volume as a keep-alive
            keepAlivePlayer = new MediaPlayer();
            AssetFileDescriptor afd = getResources().openRawResourceFd(R.raw.interval_bell);
            if (afd != null) {
                keepAlivePlayer.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                afd.close();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    AudioAttributes aa = new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .build();
                    keepAlivePlayer.setAudioAttributes(aa);
                }
                keepAlivePlayer.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
                keepAlivePlayer.setLooping(true);
                keepAlivePlayer.setVolume(0.001f, 0.001f);
                keepAlivePlayer.prepare();
                keepAlivePlayer.start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Play start bell immediately
        playBell(R.raw.start_bell, false);

        // Start native timer
        startTimeMillis = SystemClock.elapsedRealtime();
        lastIntervalPlayed = 0;
        timerHandler.removeCallbacks(timerRunnable);
        timerHandler.postDelayed(timerRunnable, 1000);

        return START_STICKY;
    }

    private void playBell(int resId, boolean fadeOut) {
        try {
            final MediaPlayer bell = new MediaPlayer();
            AssetFileDescriptor afd = getResources().openRawResourceFd(resId);
            if (afd == null) return;
            bell.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            afd.close();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                AudioAttributes aa = new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build();
                bell.setAudioAttributes(aa);
            }
            bell.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            bell.prepare();
            bell.start();
            activeBells.add(bell);

            if (fadeOut) {
                final long fadeStartDelayMs = 7000;
                final long fadeDurationMs = 3000;
                final long startTime = System.currentTimeMillis();
                final Handler fadeHandler = new Handler(Looper.getMainLooper());
                fadeHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            long elapsed = System.currentTimeMillis() - (startTime + fadeStartDelayMs);
                            float volume = Math.max(0f, 1.0f - ((float) elapsed / fadeDurationMs));
                            if (volume > 0) {
                                if (bell.isPlaying()) {
                                    bell.setVolume(volume, volume);
                                    fadeHandler.postDelayed(this, 100);
                                } else {
                                    activeBells.remove(bell);
                                    bell.release();
                                }
                            } else {
                                if (bell.isPlaying()) bell.stop();
                                activeBells.remove(bell);
                                bell.release();
                            }
                        } catch (Exception e) {
                            try { 
                                activeBells.remove(bell);
                                bell.release(); 
                            } catch (Exception ignored) {}
                        }
                    }
                }, fadeStartDelayMs);
            } else {
                bell.setOnCompletionListener(mp -> {
                    activeBells.remove(mp);
                    mp.release();
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        timerHandler.removeCallbacks(timerRunnable);
        if (keepAlivePlayer != null) {
            keepAlivePlayer.stop();
            keepAlivePlayer.release();
            keepAlivePlayer = null;
        }
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Meditation Service Channel",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }
}
