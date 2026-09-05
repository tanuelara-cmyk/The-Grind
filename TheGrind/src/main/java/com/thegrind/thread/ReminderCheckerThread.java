package com.thegrind.thread;

import com.thegrind.service.ReminderService;

/**
 * Class: ReminderCheckerThread
 * Demonstrates:
 * - Multithreading in Java (implements Runnable / Thread lifecycle)
 * - Safe concurrency with volatile flag
 * - Exception handling for InterruptedException
 * - Background task scheduling without heavy resource consumption
 */
public class ReminderCheckerThread implements Runnable {

    private final ReminderService reminderService;
    private volatile boolean running;
    private final long checkIntervalMillis;
    private Thread workerThread;

    public ReminderCheckerThread(ReminderService reminderService) {
        this.reminderService = reminderService;
        this.running = false;
        // Check every 60 seconds (safe, non-blocking interval)
        this.checkIntervalMillis = 60000;
    }

    /**
     * Starts the background daemon thread.
     */
    public synchronized void start() {
        if (!running) {
            running = true;
            workerThread = new Thread(this, "Grind-ReminderChecker-Thread");
            workerThread.setDaemon(true); // Daemon thread exits when Tomcat/JVM shuts down
            workerThread.start();
            System.out.println("[ReminderCheckerThread] Background thread started successfully.");
        }
    }

    /**
     * Stops the background thread gracefully.
     */
    public synchronized void stop() {
        running = false;
        if (workerThread != null) {
            workerThread.interrupt();
            System.out.println("[ReminderCheckerThread] Background thread stop requested.");
        }
    }

    @Override
    public void run() {
        System.out.println("[ReminderCheckerThread] Worker loop initialized.");
        while (running) {
            try {
                // Perform reminder check
                if (reminderService != null && reminderService.isOperational()) {
                    int checked = reminderService.checkDueReminders();
                    if (checked > 0) {
                        System.out.println("[ReminderCheckerThread] Dispatched " + checked + " due reminder notifications.");
                    }
                }

                // Sleep for the defined interval
                Thread.sleep(checkIntervalMillis);

            } catch (InterruptedException e) {
                // Graceful thread interruption handling
                System.out.println("[ReminderCheckerThread] Thread interrupted during sleep, terminating cleanly.");
                running = false;
                Thread.currentThread().interrupt();
            } catch (Exception e) {
                System.err.println("[ReminderCheckerThread] Unexpected error in worker loop: " + e.getMessage());
            }
        }
        System.out.println("[ReminderCheckerThread] Worker loop terminated.");
    }

    public boolean isRunning() {
        return running;
    }
}
