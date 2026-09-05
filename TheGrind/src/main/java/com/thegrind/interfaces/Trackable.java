package com.thegrind.interfaces;

/**
 * Interface: Trackable
 * Demonstrates multiple inheritance through interfaces in Java.
 * Entities implementing Trackable participate in streak and progress calculations.
 */
public interface Trackable {
    int getProgressPercentage();
    boolean isGoalAchieved();
    String getTrackingMetric();
}
