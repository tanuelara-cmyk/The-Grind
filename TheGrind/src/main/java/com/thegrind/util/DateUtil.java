package com.thegrind.util;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

/**
 * Class: DateUtil
 * Provides date calculations, formatting, and day-of-week resolvers.
 */
public class DateUtil {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
    private static final SimpleDateFormat DISPLAY_FORMAT = new SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.ENGLISH);

    public static Date getTodaySqlDate() {
        return new Date(System.currentTimeMillis());
    }

    public static String formatTodayDisplay() {
        return DISPLAY_FORMAT.format(new java.util.Date());
    }

    public static String getDayOfWeek(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.ENGLISH);
    }

    public static Date[] getLast7Days() {
        Date[] days = new Date[7];
        Calendar cal = Calendar.getInstance();
        for (int i = 6; i >= 0; i--) {
            days[6 - i] = new Date(cal.getTimeInMillis());
            cal.add(Calendar.DAY_OF_MONTH, -1);
        }
        return days;
    }
}
