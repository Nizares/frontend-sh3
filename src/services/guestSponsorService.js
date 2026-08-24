// src/services/guestSponsorService.js
import api from "./api";

export const guestSponsorService = {
    /**
     * POST /guest-sponsor/auth/login - Login guest sponsor
     * @param {string} username - Username guest sponsor (format: gs_{slug})
     * @param {string} password - Password guest sponsor
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
     * POST /guest-sponsor/attendance/check-in - Check-in guest sponsor
     * @param {Object} data - { event_id, qr_code, latitude?, longitude? }
     */
    checkIn: (data) => {
        return api.post("/guest-sponsor/attendance/check-in", data);
    },

    /**
     * POST /guest-sponsor/attendance/check-out - Check-out guest sponsor
     * @param {Object} data - { event_id, qr_code, latitude?, longitude? }
     */
    checkOut: (data) => {
        return api.post("/guest-sponsor/attendance/check-out", data);
    },

    /**
     * POST /guest-sponsor/attendance/scan - Scan QR guest sponsor
     * @param {Object} data - { qr_code, event_id }
     */
    scan: (data) => {
        return api.post("/guest-sponsor/attendance/scan", data);
    },

    /**
     * GET /guest-sponsor/attendance/my - Riwayat attendance guest sponsor
     */
    getMyAttendance: () => {
        return api.get("/guest-sponsor/attendance/my");
    },
};