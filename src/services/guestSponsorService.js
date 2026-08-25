// src/services/guestSponsorService.js
import api from "./api";

export const guestSponsorService = {
    /**
     * POST /guest-sponsor/auth/login - Login guest sponsor
     */
    login: (username, password) => {
        return api.post("/guest-sponsor/auth/login", { username, password });
    },

    /**
     * GET /guest-sponsor/auth/me - Profil guest sponsor
     */
    getProfile: () => {
        return api.get("/guest-sponsor/auth/me");
    },

    /**
     * GET /guest-sponsor/events - Event yang disponsori (khusus guest sponsor)
     */
    getMyEvents: () => {
        return api.get("/guest-sponsor/events");
    },

    /**
     * GET /guest-sponsor/events/{id} - Detail event guest sponsor
     */
    getEventDetail: (id) => {
        return api.get(`/guest-sponsor/events/${id}`);
    },

    /**
     * POST /guest-sponsor/attendance/check-in - Check-in guest sponsor
     */
    checkIn: (data) => {
        return api.post("/guest-sponsor/attendance/check-in", data);
    },

    /**
     * POST /guest-sponsor/attendance/check-out - Check-out guest sponsor
     */
    checkOut: (data) => {
        return api.post("/guest-sponsor/attendance/check-out", data);
    },

    /**
     * POST /guest-sponsor/attendance/scan - Scan QR guest sponsor
     */
    scan: (data) => {
        return api.post("/guest-sponsor/attendance/scan", data);
    },

    /**
     * GET /guest-sponsor/attendance/my - Riwayat attendance
     */
    getMyAttendance: () => {
        return api.get("/guest-sponsor/attendance/my");
    },

    /**
     * POST /guest-sponsor/auth/logout - Logout guest sponsor
     */
    logout: () => {
        return api.post("/guest-sponsor/auth/logout").catch(() => {});
    },
};