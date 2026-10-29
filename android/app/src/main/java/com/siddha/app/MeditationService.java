package com.siddha.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.SystemClock;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MeditationService extends Service {
    private static final String TAG = "MeditationService";
    private static final String CHANNEL_ID = "meditation_service_channel";
    public static final String ACTION_ALARM_TICK = "com.siddha.app.ACTION_MEDITATION_ALARM";
    private static final String PREFS_NAME = "siddha_meditation_prefs";

    private static volatile MeditationService instance;

    private PowerManager.WakeLock serviceWakeLock;
    private MediaSession mediaSession;
    private HandlerThread handlerThread;
    private Handler timerHandler;

    private int intervalSeconds = 0;
    private int totalSeconds = 0;
    private long startTimeMillis = 0;
    private int lastIntervalPlayed = 0;
    private int lastScheduledTargetSec = -1;
    private boolean isSessionCompleted = false;

    private static final List<MediaPlayer> activeBells = Collections.synchronizedList(new ArrayList<>());

    private final Runnable timerRunnable = new Runnable() {
        @Override
        public void run() {
            checkSessionProgress();
            if (!isSessionCompleted && timerHandler != null) {
                timerHandler.postDelayed(this, 1000);
            }
        }
    };

    // ==========================================
    // SharedPreferences State Persistence
    // ==========================================

    private static void saveSessionState(Context context, long startTimeMillis, int intervalSeconds, int totalSeconds, int lastIntervalPlayed, boolean isActive) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit()
                    .putLong("startTimeMillis", startTimeMillis)
                    .putInt("intervalSeconds", intervalSeconds)
                    .putInt("totalSeconds", totalSeconds)
                    .putInt("lastIntervalPlayed", lastIntervalPlayed)
                    .putBoolean("isActive", isActive)
                    .apply();
            Log.d(TAG, "Saved session state: start=" + startTimeMillis + ", interval=" + intervalSeconds + ", total=" + totalSeconds + ", lastPlayed=" + lastIntervalPlayed + ", active=" + isActive);
        } catch (Exception e) {
            Log.w(TAG, "Failed to save session state: " + e.getMessage());
        }
    }

    private static void clearSessionState(Context context) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit().clear().apply();
            Log.d(TAG, "Cleared session state");
        } catch (Exception e) {
            Log.w(TAG, "Failed to clear session state: " + e.getMessage());
        }
    }

    // ==========================================
    // Static Alarm Scheduling & Processing
    // ==========================================

    public static void scheduleMilestoneAlarm(Context context, long startTimeMillis, int intervalSeconds, int totalSeconds, int lastIntervalPlayed) {
        if (context == null || startTimeMillis <= 0 || totalSeconds <= 0) return;

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        long now = SystemClock.elapsedRealtime();
        int actualElapsedSec = (int) ((now - startTimeMillis) / 1000);

        // Find next milestone
        int nextTargetSec = totalSeconds;
        if (intervalSeconds > 0) {
            int nextIntervalSec = (lastIntervalPlayed + 1) * intervalSeconds;
            if (nextIntervalSec < totalSeconds) {
                nextTargetSec = nextIntervalSec;
            }
        }

        long remainingSec = Math.max(1, nextTargetSec - actualElapsedSec);
        long triggerAtRealtime = SystemClock.elapsedRealtime() + (remainingSec * 1000L);
        long triggerAtWallClock = System.currentTimeMillis() + (remainingSec * 1000L);

        try {
            Intent intent = new Intent(context, MeditationAlarmReceiver.class);
            intent.setAction(ACTION_ALARM_TICK);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 101, intent, flags);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                AlarmManager.AlarmClockInfo clockInfo = new AlarmManager.AlarmClockInfo(triggerAtWallClock, pendingIntent);
                alarmManager.setAlarmClock(clockInfo, pendingIntent);
                Log.d(TAG, "Scheduled setAlarmClock in " + remainingSec + "s (target: " + nextTargetSec + "s)");
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtRealtime, pendingIntent);
                Log.d(TAG, "Scheduled setExactAndAllowWhileIdle in " + remainingSec + "s (target: " + nextTargetSec + "s)");
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                alarmManager.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtRealtime, pendingIntent);
            } else {
                alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtRealtime, pendingIntent);
            }
        } catch (Exception e) {
            Log.w(TAG, "Alarm scheduling fallback: " + e.getMessage());
            try {
                Intent intent = new Intent(context, MeditationAlarmReceiver.class);
                intent.setAction(ACTION_ALARM_TICK);
                int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
                PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 101, intent, flags);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtRealtime, pendingIntent);
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    alarmManager.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtRealtime, pendingIntent);
                }
            } catch (Exception ex) {
                Log.e(TAG, "All alarm scheduling failed", ex);
            }
        }
    }

    public static void cancelAlarm(Context context) {
        if (context == null) return;
        try {
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null) {
                Intent intent = new Intent(context, MeditationAlarmReceiver.class);
                intent.setAction(ACTION_ALARM_TICK);
                int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags |= PendingIntent.FLAG_IMMUTABLE;
                }
                PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 101, intent, flags);
                alarmManager.cancel(pendingIntent);
                pendingIntent.cancel();
                Log.d(TAG, "Cancelled exact alarm");
            }
        } catch (Exception ignored) {}
    }

    public static synchronized void processAlarmTick(Context context) {
        Log.d(TAG, "processAlarmTick invoked");
        MeditationService svc = instance;
        if (svc != null && !svc.isSessionCompleted) {
            svc.checkSessionProgress();
            return;
        }

        // If service instance was not in memory, handle directly from persisted state
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            boolean isActive = prefs.getBoolean("isActive", false);
            if (!isActive) {
                Log.d(TAG, "No active session in SharedPreferences, ignoring tick");
                return;
            }

            long startTimeMillis = prefs.getLong("startTimeMillis", 0);
            int intervalSeconds = prefs.getInt("intervalSeconds", 0);
            int totalSeconds = prefs.getInt("totalSeconds", 0);
            int lastIntervalPlayed = prefs.getInt("lastIntervalPlayed", 0);

            if (startTimeMillis <= 0 || totalSeconds <= 0) return;

            long now = SystemClock.elapsedRealtime();
            int actualElapsedSec = (int) ((now - startTimeMillis) / 1000);
            Log.d(TAG, "Static processAlarmTick: elapsed=" + actualElapsedSec + "s / total=" + totalSeconds + "s, interval=" + intervalSeconds + "s");

            if (intervalSeconds > 0) {
                int currentIntervalBoundary = actualElapsedSec / intervalSeconds;
                if (currentIntervalBoundary > lastIntervalPlayed && actualElapsedSec < totalSeconds && actualElapsedSec > 0) {
                    Log.d(TAG, ">>> STATIC TRIGGER: INTERVAL BELL (Boundary " + currentIntervalBoundary + ") <<<");
                    playBellSound(context, R.raw.interval_bell, true, 25000L);
                    lastIntervalPlayed = currentIntervalBoundary;
                    saveSessionState(context, startTimeMillis, intervalSeconds, totalSeconds, lastIntervalPlayed, true);
                }
            }

            if (actualElapsedSec >= totalSeconds) {
                Log.d(TAG, ">>> STATIC TRIGGER: COMPLETION END BELL <<<");
                playBellSound(context, R.raw.end_bell, false, 60000L);
                clearSessionState(context);
                cancelAlarm(context);
            } else {
                scheduleMilestoneAlarm(context, startTimeMillis, intervalSeconds, totalSeconds, lastIntervalPlayed);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error in processAlarmTick", e);
        }
    }

    // ==========================================
    // Reliable Bell Sound Playback
    // ==========================================

    public static void playBellSound(Context context, int resId, boolean fadeOut, long wakeLockDurationMs) {
        PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock soundWakeLock = null;
        if (pm != null) {
            try {
                soundWakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Siddha::BellSoundWakeLock");
                soundWakeLock.acquire(wakeLockDurationMs);
            } catch (Exception e) {
                Log.w(TAG, "WakeLock acquire warning: " + e.getMessage());
            }
        }

        // Request transient audio focus
        try {
            AudioManager am = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
            if (am != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    AudioAttributes aa = new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
                            .build();
                    AudioFocusRequest request = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                            .setAudioAttributes(aa)
                            .build();
                    am.requestAudioFocus(request);
                } else {
                    am.requestAudioFocus(null, AudioManager.STREAM_ALARM, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "Audio focus request warning: " + e.getMessage());
        }

        final PowerManager.WakeLock heldWakeLock = soundWakeLock;

        try {
            final MediaPlayer player = new MediaPlayer();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                AudioAttributes aa = new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setFlags(AudioAttributes.FLAG_AUDIBILITY_ENFORCED)
                        .build();
                player.setAudioAttributes(aa);
            } else {
                player.setAudioStreamType(AudioManager.STREAM_ALARM);
            }

            AssetFileDescriptor afd = context.getResources().openRawResourceFd(resId);
            if (afd == null) {
                Log.e(TAG, "Could not open raw resource fd for resId: " + resId);
                if (heldWakeLock != null && heldWakeLock.isHeld()) heldWakeLock.release();
                return;
            }

            player.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            afd.close();

            player.setWakeMode(context.getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);
            player.setVolume(1.0f, 1.0f);
            player.prepare();
            player.start();
            activeBells.add(player);
            Log.d(TAG, "Bell sound started successfully (resId=" + resId + ")");

            if (fadeOut) {
                final long fadeStartDelayMs = 6000;
                final long fadeDurationMs = 4000;
                final long startTime = System.currentTimeMillis();
                final Handler fadeHandler = new Handler(Looper.getMainLooper());

                fadeHandler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            long elapsed = System.currentTimeMillis() - (startTime + fadeStartDelayMs);
                            float volume = Math.max(0f, 1.0f - ((float) elapsed / fadeDurationMs));
                            if (volume > 0 && player.isPlaying()) {
                                player.setVolume(volume, volume);
                                fadeHandler.postDelayed(this, 100);
                            } else {
                                if (player.isPlaying()) player.stop();
                                activeBells.remove(player);
                                player.release();
                                if (heldWakeLock != null && heldWakeLock.isHeld()) {
                                    heldWakeLock.release();
                                }
                            }
                        } catch (Exception e) {
                            try {
                                activeBells.remove(player);
                                player.release();
                            } catch (Exception ignored) {}
                            try {
                                if (heldWakeLock != null && heldWakeLock.isHeld()) {
                                    heldWakeLock.release();
                                }
                            } catch (Exception ignored) {}
                        }
                    }
                }, fadeStartDelayMs);
            } else {
                player.setOnCompletionListener(mp -> {
                    Log.d(TAG, "Bell sound finished naturally");
                    activeBells.remove(mp);
                    try { mp.release(); } catch (Exception ignored) {}
                    try {
                        if (heldWakeLock != null && heldWakeLock.isHeld()) {
                            heldWakeLock.release();
                        }
                    } catch (Exception ignored) {}
                });
            }

        } catch (Exception e) {
            Log.e(TAG, "Error playing bell sound", e);
            if (heldWakeLock != null && heldWakeLock.isHeld()) {
                try { heldWakeLock.release(); } catch (Exception ignored) {}
            }
        }
    }

    // ==========================================
    // Service Lifecycle
    // ==========================================

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        Log.d(TAG, "MeditationService onCreate");

        createNotificationChannel();

        handlerThread = new HandlerThread("MeditationServiceBackground");
        handlerThread.start();
        timerHandler = new Handler(handlerThread.getLooper());

        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (powerManager != null) {
            serviceWakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Siddha::MeditationServiceWakeLock");
            serviceWakeLock.acquire(180 * 60 * 1000L); // 3 hours max
        }

        // Initialize Android MediaSession for Android 14 mediaPlayback foreground service
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                mediaSession = new MediaSession(this, "SiddhaMeditationSession");
                PlaybackState state = new PlaybackState.Builder()
                        .setActions(PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE | PlaybackState.ACTION_STOP)
                        .setState(PlaybackState.STATE_PLAYING, PlaybackState.PLAYBACK_POSITION_UNKNOWN, 1.0f)
                        .build();
                mediaSession.setPlaybackState(state);
                mediaSession.setActive(true);
            }
        } catch (Exception e) {
            Log.w(TAG, "MediaSession init warning: " + e.getMessage());
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_ALARM_TICK.equals(intent.getAction())) {
            Log.d(TAG, "onStartCommand: ALARM_TICK received!");
            checkSessionProgress();
            return START_STICKY;
        }

        Log.d(TAG, "MeditationService onStartCommand - STARTING NEW SESSION");
        if (intent != null) {
            intervalSeconds = intent.getIntExtra("intervalSeconds", 0);
            totalSeconds = intent.getIntExtra("totalSeconds", 0);
        }

        isSessionCompleted = false;
        startTimeMillis = SystemClock.elapsedRealtime();
        lastIntervalPlayed = 0;
        lastScheduledTargetSec = -1;

        // Persist session state immediately
        saveSessionState(this, startTimeMillis, intervalSeconds, totalSeconds, 0, true);

        NotificationCompat.Builder notifBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Meditation in Progress")
                .setContentText("Keeping your sanctuary peaceful...")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOngoing(true);

        Notification notification = notifBuilder.build();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(1, notification);
        }

        // Start handler timing loop for when screen is active
        if (timerHandler != null) {
            timerHandler.removeCallbacks(timerRunnable);
            timerHandler.postDelayed(timerRunnable, 1000);
        }

        // Schedule exact milestone alarm for lock screen / deep Doze
        scheduleMilestoneAlarm(this, startTimeMillis, intervalSeconds, totalSeconds, 0);

        return START_STICKY;
    }

    public synchronized void checkSessionProgress() {
        if (isSessionCompleted || startTimeMillis <= 0) return;

        long now = SystemClock.elapsedRealtime();
        int actualElapsedSeconds = (int) ((now - startTimeMillis) / 1000);
        Log.d(TAG, "Service Tick: elapsed=" + actualElapsedSeconds + "s / total=" + totalSeconds + "s, interval=" + intervalSeconds + "s");

        // Check interval bell
        boolean intervalPlayedThisTick = false;
        if (intervalSeconds > 0) {
            int currentIntervalBoundary = actualElapsedSeconds / intervalSeconds;
            if (currentIntervalBoundary > lastIntervalPlayed && actualElapsedSeconds < totalSeconds && actualElapsedSeconds > 0) {
                Log.d(TAG, ">>> TRIGGERING INTERVAL BELL (Boundary " + currentIntervalBoundary + ") <<<");
                playBellSound(this, R.raw.interval_bell, true, 25000L);
                lastIntervalPlayed = currentIntervalBoundary;
                intervalPlayedThisTick = true;
                saveSessionState(this, startTimeMillis, intervalSeconds, totalSeconds, lastIntervalPlayed, true);
            }
        }

        // Check completion
        if (actualElapsedSeconds >= totalSeconds) {
            Log.d(TAG, ">>> TRIGGERING COMPLETION END BELL <<<");
            isSessionCompleted = true;
            if (timerHandler != null) {
                timerHandler.removeCallbacks(timerRunnable);
            }
            cancelAlarm(this);
            clearSessionState(this);

            playBellSound(this, R.raw.end_bell, false, 60000L);

            // Auto-stop service after 45s delay to allow completion chimes to finish
            if (timerHandler != null) {
                timerHandler.postDelayed(this::stopSelf, 45000);
            }
        } else if (intervalPlayedThisTick || lastScheduledTargetSec == -1) {
            // Only re-arm the exact alarm if we just crossed an interval boundary or haven't scheduled yet
            int nextTargetSec = totalSeconds;
            if (intervalSeconds > 0) {
                int nextIntervalSec = (lastIntervalPlayed + 1) * intervalSeconds;
                if (nextIntervalSec < totalSeconds) {
                    nextTargetSec = nextIntervalSec;
                }
            }
            if (nextTargetSec != lastScheduledTargetSec) {
                lastScheduledTargetSec = nextTargetSec;
                scheduleMilestoneAlarm(this, startTimeMillis, intervalSeconds, totalSeconds, lastIntervalPlayed);
            }
        }
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "MeditationService onDestroy");
        if (instance == this) instance = null;
        isSessionCompleted = true;
        cancelAlarm(this);
        clearSessionState(this);

        if (timerHandler != null) {
            timerHandler.removeCallbacks(timerRunnable);
        }
        if (handlerThread != null) {
            handlerThread.quitSafely();
        }

        if (mediaSession != null) {
            try {
                mediaSession.setActive(false);
                mediaSession.release();
            } catch (Exception ignored) {}
            mediaSession = null;
        }

        synchronized (activeBells) {
            for (MediaPlayer player : activeBells) {
                try {
                    if (player.isPlaying()) player.stop();
                    player.release();
                } catch (Exception ignored) {}
            }
            activeBells.clear();
        }

        if (serviceWakeLock != null && serviceWakeLock.isHeld()) {
            serviceWakeLock.release();
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
                    NotificationManager.IMPORTANCE_HIGH
            );
            serviceChannel.setDescription("Maintains background timer and bell chimes during meditation");
            serviceChannel.setSound(null, null);
            serviceChannel.enableVibration(false);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }
}
