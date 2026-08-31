// src/services/pointService.js
import api from "./api";

export const pointService = {
    /**
     * GET /points/balance - Saldo poin user
     */
    getBalance: () => {
        return api.get("/points/balance");
    },

    /**
     * GET /points/history - Riwayat transaksi poin
     */
    getHistory: (params = {}) => {
        return api.get("/points/history", { params });
    },
};