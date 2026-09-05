package com.thegrind.listener;

import com.thegrind.service.ReminderService;
import com.thegrind.thread.ReminderCheckerThread;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * Class: AppContextListener
 * Demonstrates:
 * - ServletContextListener lifecycle management
 * - Clean initialization & termination of background daemon multithreading
 */
@WebListener
public class AppContextListener implements ServletContextListener {

    private ReminderCheckerThread reminderThread;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("[AppContextListener] Web application initialized.");

        String enableThread = sce.getServletContext().getInitParameter("enableBackgroundReminderThread");
        if ("true".equalsIgnoreCase(enableThread)) {
            ReminderService reminderService = new ReminderService();
            reminderThread = new ReminderCheckerThread(reminderService);
            reminderThread.start();
            sce.getServletContext().setAttribute("reminderThread", reminderThread);
            System.out.println("[AppContextListener] Background reminder multithreading activated.");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("[AppContextListener] Web application shutting down.");
        if (reminderThread != null) {
            reminderThread.stop();
        }
    }
}
